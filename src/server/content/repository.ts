import { db } from '@/db';
import { content, contentLabels, contentTags } from '@/db/schema';
import BaseRepository from '@/server/base/BaseRepository';
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  isNotNull,
  like,
  ne,
  or,
  sql,
} from 'drizzle-orm';
import { QueryOptions } from '../base/BaseRepository';
import { contentUpdateLogRepository } from '../content-update-logs/repository';

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

  async getByUser(userId: string, page: number = 1, size: number = 12) {
    const offset = (page - 1) * size;
    const items = await db
      .select({
        id: content.id,
        type: content.type,
        description: content.description,
        fileName: content.fileName,
        thumbnailKey: content.thumbnailKey,
        createdAt: content.createdAt,
      })
      .from(content)
      .where(and(eq(content.userId, userId), eq(content.status, 'published')))
      .orderBy(desc(content.createdAt))
      .limit(size)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(content)
      .where(and(eq(content.userId, userId), eq(content.status, 'published')));

    const totalItems = countResult[0]?.count ?? 0;

    return {
      items,
      totalPages: Math.ceil(totalItems / size),
      totalItems,
      currentPage: page,
    };
  }

  async getContentByTag(
    tagId: string,
    options: QueryOptions<typeof content> = {},
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

    conditions.push(eq(content.status, 'published'));

    if (search) {
      conditions.push(
        or(
          ilike(content.fileName, `%${search}%`),
          and(
            isNotNull(content.description),
            ilike(content.description, `%${search}%`),
          ),
        ),
      );
    }

    const baseSelect = {
      id: content.id,
      userId: content.userId,
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

  async getSimilarContent(contentId: string, limit: number = 20) {
    const items = await db
      .select({
        ...getTableColumns(content),
        commonLabelsCount: sql<number>`count(DISTINCT ${contentLabels.name})`,
      })
      .from(content)
      .innerJoin(contentLabels, eq(content.id, contentLabels.contentId))
      .where(
        and(
          ne(content.id, contentId),
          eq(content.status, 'published'),
          sql`${contentLabels.name} IN (
            SELECT cl.name
            FROM ${contentLabels} cl
            WHERE cl.content_id = ${contentId}
          )`,
        ),
      )
      .groupBy(content.id)
      .having(sql`count(DISTINCT ${contentLabels.name}) >= 5`)
      .orderBy(
        sql`count(DISTINCT ${contentLabels.name}) DESC`,
        desc(content.createdAt),
      )
      .limit(limit);

    return items;
  }

  async getContentWithDetails(id: string) {
    return await db.query.content.findFirst({
      where: eq(content.id, id),
      with: {
        user: true,
        location: true,
        tags: {
          with: {
            tag: true,
          },
        },
        labels: true,
      },
    });
  }

  async updateWithAuditLog(
    id: string,
    updateData: Partial<typeof content.$inferInsert>,
    userId: string,
  ) {
    const currentRecord = await this.findById(id);
    if (!currentRecord) {
      throw new Error('Content not found');
    }

    const updatedRecord = await this.update(id, updateData);

    const trackedFields = ['description', 'locationId', 'status'] as const;
    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    trackedFields.forEach((field) => {
      if (field in updateData && currentRecord[field] !== updateData[field]) {
        oldValues[field] = currentRecord[field];
        newValues[field] = updateData[field];
      }
    });

    if (Object.keys(oldValues).length > 0) {
      await contentUpdateLogRepository.create({
        contentId: id,
        userId,
        action: 'update',
        oldValues,
        newValues,
      });
    }

    return updatedRecord;
  }

  async deleteWithAuditLog(id: string, userId: string) {
    const currentRecord = await this.findById(id);
    if (!currentRecord) {
      throw new Error('Content not found');
    }

    await contentUpdateLogRepository.create({
      contentId: id,
      userId,
      action: 'delete',
      oldValues: currentRecord as Record<string, unknown>,
      newValues: null,
    });

    await this.delete(id);
  }
}

export const contentRepository = new ContentRepository();
