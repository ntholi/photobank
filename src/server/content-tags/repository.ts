import BaseRepository from '@/server/base/BaseRepository';
import { contentTags, tags } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '@/db';

export default class ContentTagRepository extends BaseRepository<
  typeof contentTags,
  'contentId'
> {
  constructor() {
    super(contentTags, contentTags.contentId);
  }

  async getContentTags(contentId: string) {
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
  }

  async getById(contentId: string, tagId: string) {
    return db
      .select()
      .from(contentTags)
      .where(
        and(eq(contentTags.contentId, contentId), eq(contentTags.tagId, tagId))
      )
      .limit(1)
      .then((results) => results[0] || null);
  }

  async updateById(
    contentId: string,
    tagId: string,
    data: Partial<typeof contentTags.$inferInsert>
  ) {
    const result = await db
      .update(contentTags)
      .set(data)
      .where(
        and(eq(contentTags.contentId, contentId), eq(contentTags.tagId, tagId))
      )
      .returning();

    if (result.length === 0) {
      throw new Error('ContentTag not found');
    }

    return result[0];
  }

  async deleteById(contentId: string, tagId: string) {
    await db
      .delete(contentTags)
      .where(
        and(eq(contentTags.contentId, contentId), eq(contentTags.tagId, tagId))
      );
  }

  async findTagsByNames(tagNames: string[]) {
    return db
      .select()
      .from(tags)
      .where(
        tagNames.length === 1
          ? eq(tags.name, tagNames[0])
          : inArray(tags.name, tagNames)
      );
  }
}

export const contentTagsRepository = new ContentTagRepository();
