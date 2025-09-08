import { db } from '@/db';
import { contentUpdateLogs, users, locations } from '@/db/schema';
import BaseRepository from '@/server/base/BaseRepository';
import { desc, eq } from 'drizzle-orm';

export default class ContentUpdateLogRepository extends BaseRepository<
  typeof contentUpdateLogs,
  'id'
> {
  constructor() {
    super(contentUpdateLogs, contentUpdateLogs.id);
  }

  async getByContentIdWithUser(
    contentId: string,
    page: number = 1,
    size: number = 20,
  ) {
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
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          image: users.image,
        },
      })
      .from(contentUpdateLogs)
      .leftJoin(users, eq(contentUpdateLogs.userId, users.id))
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

  async logTagChange(
    contentId: string,
    userId: string,
    oldTags: Array<{ name: string; confidence: number }>,
    newTags: Array<{ name: string; confidence: number }>,
  ) {
    const oldValues = { tags: oldTags };
    const newValues = { tags: newTags };

    return this.create({
      contentId,
      userId,
      action: 'update',
      oldValues,
      newValues,
    });
  }
}

export const contentUpdateLogRepository = new ContentUpdateLogRepository();
