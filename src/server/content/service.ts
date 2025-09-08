import { content } from '@/db/schema';
import ContentRepository, { ContentFilterOptions } from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';
import { notificationsService } from '@/server/notifications/service';
import { notifications } from '@/db/schema';

type Content = typeof content.$inferInsert;

class ContentService {
  constructor(private readonly repository = new ContentRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), ['all']);
  }

  async getAll(params: QueryOptions<typeof content>) {
    return withAuth(async () => this.repository.query(params), ['all']);
  }

  async create(data: Content) {
    return withAuth(
      async (session) =>
        this.repository.create({ ...data, userId: session?.user.id as string }),
      ['contributor'],
    );
  }

  async update(id: string, data: Partial<Content>) {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required for content update');
        }
        const updated = await this.repository.updateWithAuditLog(
          id,
          data,
          session.user.id,
        );

        if (updated) {
          try {
            const ownerId = (updated as any).userId as string | undefined;
            if (ownerId) {
              const changedFields = Object.keys(data || {});
              const title = 'Your content was updated';
              const body =
                changedFields.length > 0
                  ? `Fields changed: ${changedFields.join(', ')}`
                  : 'Your content item has new updates.';
              await notificationsService.create({
                recipientUserId: ownerId,
                type: 'content_updated',
                title,
                body,
                payload: { contentId: id, changedFields },
              } as typeof notifications.$inferInsert);
            }
          } catch (e) {
            console.error('Failed to create update notification', e);
          }
        }
        return updated;
      },
      async (session) => {
        if (['moderator', 'admin'].includes(session.user.role)) {
          return true;
        }
        return data?.userId === session.user.id;
      },
    );
  }

  async delete(id: string) {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required for content deletion');
        }
        return this.repository.deleteWithAuditLog(id, session.user.id);
      },
      ['admin'],
    );
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async getContentByTag(
    tagId: string,
    params: QueryOptions<typeof content> = {},
  ) {
    return withAuth(
      async () => this.repository.getContentByTag(tagId, params),
      ['all'],
    );
  }

  async getFilteredContent(options: ContentFilterOptions) {
    return withAuth(
      async () => this.repository.getFilteredContent(options),
      ['all'],
    );
  }

  async getSimilarContent(contentId: string, limit: number = 20) {
    return withAuth(
      async () => this.repository.getSimilarContent(contentId, limit),
      ['all'],
    );
  }

  async getContentWithDetails(id: string) {
    return withAuth(
      async () => this.repository.getContentWithDetails(id),
      ['all'],
    );
  }

  async getByUser(userId: string, page: number = 1, size: number = 12) {
    return withAuth(
      async () => this.repository.getByUser(userId, page, size),
      ['all'],
    );
  }
}

export const contentService = serviceWrapper(ContentService, 'Content');
