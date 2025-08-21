import { contentTags, tags } from '@/db/schema';
import ContentTagRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '@/db';

type ContentTag = typeof contentTags.$inferInsert;

class ContentTagService {
  constructor(private readonly repository = new ContentTagRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(contentId: string, tagId: string) {
    return withAuth(async () => {
      return db
        .select()
        .from(contentTags)
        .where(
          and(
            eq(contentTags.contentId, contentId),
            eq(contentTags.tagId, tagId)
          )
        )
        .limit(1)
        .then((results) => results[0] || null);
    }, []);
  }

  async getAll(params: QueryOptions<typeof contentTags>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: ContentTag) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(contentId: string, tagId: string, data: Partial<ContentTag>) {
    return withAuth(async () => {
      const result = await db
        .update(contentTags)
        .set(data)
        .where(
          and(
            eq(contentTags.contentId, contentId),
            eq(contentTags.tagId, tagId)
          )
        )
        .returning();

      if (result.length === 0) {
        throw new Error('ContentTag not found');
      }

      return result[0];
    }, []);
  }

  async delete(contentId: string, tagId: string) {
    return withAuth(async () => {
      await db
        .delete(contentTags)
        .where(
          and(
            eq(contentTags.contentId, contentId),
            eq(contentTags.tagId, tagId)
          )
        );
    }, []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async createContentTags(
    contentId: string,
    selectedTags: Array<{ tag: string; confidence: number }>
  ) {
    return withAuth(async () => {
      if (selectedTags.length === 0) {
        return [];
      }

      const tagNames = selectedTags.map((item) => item.tag);
      const tagRecords = await db
        .select()
        .from(tags)
        .where(
          tagNames.length === 1
            ? eq(tags.name, tagNames[0])
            : inArray(tags.name, tagNames)
        );

      if (tagRecords.length === 0) {
        console.log('No matching tags found in database for:', tagNames);
        return [];
      }

      const contentTagsToInsert: ContentTag[] = tagRecords.map(
        (tag: typeof tags.$inferSelect) => {
          const selectedTag = selectedTags.find(
            (item) => item.tag === tag.name
          );
          return {
            contentId,
            tagId: tag.id,
            confidence: selectedTag?.confidence || 100,
          };
        }
      );

      return await this.repository.createMany(contentTagsToInsert);
    }, ['contributor']);
  }

  async getContentTagsByContentId(contentId: string) {
    return withAuth(async () => {
      return db
        .select({
          contentId: contentTags.contentId,
          tagId: contentTags.tagId,
          confidence: contentTags.confidence,
          createdAt: contentTags.createdAt,
          tagName: tags.name,
          tagSlug: tags.slug,
        })
        .from(contentTags)
        .innerJoin(tags, eq(contentTags.tagId, tags.id))
        .where(eq(contentTags.contentId, contentId));
    }, []);
  }
}

export const contentTagsService = serviceWrapper(
  ContentTagService,
  'ContentTag'
);
