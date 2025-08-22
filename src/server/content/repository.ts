import BaseRepository from '@/server/base/BaseRepository';
import { content, contentTags } from '@/db/schema';
import { db } from '@/db';
import { eq, count, and, inArray, like, sql, desc } from 'drizzle-orm';
import { QueryOptions } from '../base/BaseRepository';

export interface ContentFilterOptions {
  page?: number;
  size?: number;
  locationId?: string;
  tagIds?: string[];
  search?: string;
}

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
        type: content.type,
        description: content.description,
        fileName: content.fileName,
        s3Key: content.s3Key,
        thumbnailKey: content.thumbnailKey,
        watermarkedKey: content.watermarkedKey,
        fileSize: content.fileSize,
        locationId: content.locationId,
        status: content.status,
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

  async getFilteredContent(options: ContentFilterOptions) {
    const {
      page = 1,
      size = 12,
      locationId,
      tagIds = [],
      search = '',
    } = options;

    const offset = (page - 1) * size;
    const conditions = [];

    if (locationId) {
      conditions.push(eq(content.locationId, locationId));
    }

    if (search) {
      conditions.push(like(content.fileName, `%${search}%`));
      conditions.push(like(content.description, `%${search}%`));
    }

    const baseSelect = {
      id: content.id,
      type: content.type,
      description: content.description,
      fileName: content.fileName,
      s3Key: content.s3Key,
      thumbnailKey: content.thumbnailKey,
      watermarkedKey: content.watermarkedKey,
      fileSize: content.fileSize,
      locationId: content.locationId,
      status: content.status,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };

    let items;
    let totalItems: number;

    if (tagIds.length > 0) {
      items = await db
        .select(baseSelect)
        .from(content)
        .innerJoin(contentTags, eq(content.id, contentTags.contentId))
        .where(and(...conditions, inArray(contentTags.tagId, tagIds)))
        .groupBy(content.id)
        .orderBy(desc(content.createdAt))
        .limit(size)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(DISTINCT ${content.id})` })
        .from(content)
        .innerJoin(contentTags, eq(content.id, contentTags.contentId))
        .where(and(...conditions, inArray(contentTags.tagId, tagIds)));

      totalItems = countResult[0]?.count ?? 0;
    } else {
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      items = await db
        .select(baseSelect)
        .from(content)
        .where(whereClause)
        .orderBy(desc(content.createdAt))
        .limit(size)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(content)
        .where(whereClause);

      totalItems = countResult[0]?.count ?? 0;
    }

    return {
      items,
      totalPages: Math.ceil(totalItems / size),
      totalItems,
      currentPage: page,
    };
  }
}

export const contentRepository = new ContentRepository();
