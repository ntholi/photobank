import BaseRepository from '@/server/base/BaseRepository';
import { content, contentTags } from '@/db/schema';
import { db } from '@/db';
import { eq, count } from 'drizzle-orm';
import { QueryOptions } from '../base/BaseRepository';

export default class ContentRepository extends BaseRepository<
  typeof content,
  'id'
> {
  constructor() {
    super(content, content.id);
  }

  async getContentByTag(
    tagId: string,
    options: QueryOptions<typeof content> = {}
  ) {
    const {
      page = 1,
      size = 15,
      sort = [{ column: 'createdAt', order: 'desc' }],
    } = options;

    const offset = (page - 1) * size;

    const items = await db
      .select({
        id: content.id,
        fileName: content.fileName,
        s3Key: content.s3Key,
        thumbnailKey: content.thumbnailKey,
        watermarkedKey: content.watermarkedKey,
        type: content.type,
        status: content.status,
        locationId: content.locationId,
        fileSize: content.fileSize,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      })
      .from(content)
      .innerJoin(contentTags, eq(content.id, contentTags.contentId))
      .where(eq(contentTags.tagId, tagId))
      .orderBy(content.createdAt)
      .limit(size)
      .offset(offset);

    const totalItems = await db
      .select({ count: count() })
      .from(content)
      .innerJoin(contentTags, eq(content.id, contentTags.contentId))
      .where(eq(contentTags.tagId, tagId))
      .then(([result]) => result?.count ?? 0);

    return {
      items,
      totalPages: Math.ceil(totalItems / size),
      totalItems,
    };
  }
}

export const contentRepository = new ContentRepository();
