import { contentTags, tags, notifications, content } from '@/db/schema';
import ContentTagRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';
import { contentUpdateLogRepository } from '../content-update-logs/repository';
import { notificationsService } from '@/server/notifications/service';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

type ContentTag = typeof contentTags.$inferInsert;

class ContentTagService {
  constructor(private readonly repository = new ContentTagRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(contentId: string, tagId: string) {
    return withAuth(async () => {
      return this.repository.getById(contentId, tagId);
    }, []);
  }

  async getAll(params: QueryOptions<typeof contentTags>) {
    return withAuth(async () => this.repository.query(params), ['all']);
  }

  async create(data: ContentTag) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(contentId: string, tagId: string, data: Partial<ContentTag>) {
    return withAuth(async () => {
      return this.repository.updateByCompositeId(contentId, tagId, data);
    }, []);
  }

  async delete(contentId: string, tagId: string) {
    return withAuth(async () => {
      return this.repository.deleteByCompositeId(contentId, tagId);
    }, []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async createContentTags(
    contentId: string,
    selectedTags: Array<{ tag: string; confidence: number }>,
  ) {
    return withAuth(async () => {
      if (selectedTags.length === 0) {
        return [];
      }

      const tagNames = selectedTags.map((item) => item.tag);
      const tagRecords = await this.repository.findTagsByNames(tagNames);

      if (tagRecords.length === 0) {
        console.log('No matching tags found in database for:', tagNames);
        return [];
      }

      const contentTagsToInsert: ContentTag[] = tagRecords.map(
        (tag: typeof tags.$inferSelect) => {
          const selectedTag = selectedTags.find(
            (item) => item.tag === tag.name,
          );
          return {
            contentId,
            tagId: tag.id,
            confidence: selectedTag?.confidence || 100,
          };
        },
      );

      return await this.repository.createMany(contentTagsToInsert);
    }, ['contributor']);
  }

  async getContentTags(contentId: string) {
    return withAuth(async () => {
      return this.repository.getContentTags(contentId);
    }, []);
  }

  async updateContentTags(
    contentId: string,
    selectedTags: Array<{ tag: string; confidence: number }>,
  ) {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required for tag updates');
        }

        // Get current tags for audit logging
        const currentTags = await this.repository.getContentTags(contentId);
        const oldTags = currentTags.map((ct) => ({
          name: ct.tagName,
          confidence: ct.confidence || 100,
        }));

        await this.repository.deleteAllByContentId(contentId);

        if (selectedTags.length === 0) {
          // Log tag removal if there were previous tags
          if (oldTags.length > 0) {
            await contentUpdateLogRepository.logTagChange(
              contentId,
              session.user.id,
              oldTags,
              [],
            );
          }
          return [];
        }

        const tagNames = selectedTags.map((item) => item.tag);
        const tagRecords = await this.repository.findTagsByNames(tagNames);

        if (tagRecords.length === 0) {
          console.log('No matching tags found in database for:', tagNames);
          return [];
        }

        const contentTagsToInsert: ContentTag[] = tagRecords.map(
          (tag: typeof tags.$inferSelect) => {
            const selectedTag = selectedTags.find(
              (item) => item.tag === tag.name,
            );
            return {
              contentId,
              tagId: tag.id,
              confidence: selectedTag?.confidence || 100,
            };
          },
        );

        const result = await this.repository.createMany(contentTagsToInsert);

        // Log tag changes
        const newTags = selectedTags.map((tag) => ({
          name: tag.tag,
          confidence: tag.confidence || 100,
        }));

        // Only log if there are actual changes
        const tagsChanged =
          JSON.stringify(oldTags.sort()) !== JSON.stringify(newTags.sort());
        if (tagsChanged) {
          await contentUpdateLogRepository.logTagChange(
            contentId,
            session.user.id,
            oldTags,
            newTags,
          );

          // Create notification for tag changes
          try {
            // Get content record to find the owner
            const contentRecord = await db.query.content.findFirst({
              where: eq(content.id, contentId),
              columns: { userId: true },
            });

            if (
              contentRecord?.userId &&
              contentRecord.userId !== session.user.id
            ) {
              const addedTags = newTags.filter(
                (newTag) =>
                  !oldTags.some((oldTag) => oldTag.name === newTag.name),
              );
              const removedTags = oldTags.filter(
                (oldTag) =>
                  !newTags.some((newTag) => newTag.name === oldTag.name),
              );

              let body = '';
              if (addedTags.length > 0 && removedTags.length > 0) {
                body = `Tags updated: Added ${addedTags.map((t) => t.name).join(', ')} | Removed ${removedTags.map((t) => t.name).join(', ')}`;
              } else if (addedTags.length > 0) {
                body = `Tags added: ${addedTags.map((t) => t.name).join(', ')}`;
              } else if (removedTags.length > 0) {
                body = `Tags removed: ${removedTags.map((t) => t.name).join(', ')}`;
              } else {
                body = 'Tags updated';
              }

              await notificationsService.create({
                recipientUserId: contentRecord.userId,
                type: 'content_updated',
                title: 'Your content tags were updated',
                body,
                payload: {
                  contentId,
                  changeType: 'tags',
                  addedTags: addedTags.map((t) => t.name),
                  removedTags: removedTags.map((t) => t.name),
                },
              } as typeof notifications.$inferInsert);
            }
          } catch (e) {
            console.error('Failed to create tag update notification', e);
          }
        }

        return result;
      },
      ['contributor', 'moderator', 'admin'],
    );
  }
}

export const contentTagsService = serviceWrapper(
  ContentTagService,
  'ContentTag',
);
