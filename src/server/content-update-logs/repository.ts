import { db } from '@/db';
import { contentUpdateLogs } from '@/db/schema';
import BaseRepository from '@/server/base/BaseRepository';
import { desc, eq } from 'drizzle-orm';

export default class ContentUpdateLogRepository extends BaseRepository<
  typeof contentUpdateLogs,
  'id'
> {
  constructor() {
    super(contentUpdateLogs, contentUpdateLogs.id);
  }

  async getByContentId(contentId: string, page: number = 1, size: number = 20) {
    const offset = (page - 1) * size;

    const items = await db
      .select({
        id: contentUpdateLogs.id,
        contentId: contentUpdateLogs.contentId,
        userId: contentUpdateLogs.userId,
        action: contentUpdateLogs.action,
        oldValues: contentUpdateLogs.oldValues,
        newValues: contentUpdateLogs.newValues,
        createdAt: contentUpdateLogs.createdAt,
      })
      .from(contentUpdateLogs)
      .where(eq(contentUpdateLogs.contentId, contentId))
      .orderBy(desc(contentUpdateLogs.createdAt))
      .limit(size)
      .offset(offset);

    const totalItems = await this.count(
      eq(contentUpdateLogs.contentId, contentId),
    );

    return {
      items,
      totalPages: Math.ceil(totalItems / size),
      totalItems,
      currentPage: page,
    };
  }

  async getByUserId(userId: string, page: number = 1, size: number = 20) {
    const offset = (page - 1) * size;

    const items = await db
      .select({
        id: contentUpdateLogs.id,
        contentId: contentUpdateLogs.contentId,
        userId: contentUpdateLogs.userId,
        action: contentUpdateLogs.action,
        oldValues: contentUpdateLogs.oldValues,
        newValues: contentUpdateLogs.newValues,
        createdAt: contentUpdateLogs.createdAt,
      })
      .from(contentUpdateLogs)
      .where(eq(contentUpdateLogs.userId, userId))
      .orderBy(desc(contentUpdateLogs.createdAt))
      .limit(size)
      .offset(offset);

    const totalItems = await this.count(eq(contentUpdateLogs.userId, userId));

    return {
      items,
      totalPages: Math.ceil(totalItems / size),
      totalItems,
      currentPage: page,
    };
  }
}

export const contentUpdateLogRepository = new ContentUpdateLogRepository();
