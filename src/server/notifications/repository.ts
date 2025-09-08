import BaseRepository from '@/server/base/BaseRepository';
import { notifications, users } from '@/db/schema';
import { db } from '@/db';
import { count, and, eq, desc, or, ilike, isNotNull, SQL } from 'drizzle-orm';
import { QueryOptions } from '@/server/base/BaseRepository';

export default class NotificationRepository extends BaseRepository<
  typeof notifications,
  'id'
> {
  constructor() {
    super(notifications, notifications.id);
  }

  async findByIdWithUser(id: string) {
    return db.query.notifications.findFirst({
      where: eq(notifications.id, id),
      with: {
        recipient: true,
      },
    });
  }

  async getUnreadCount(userId: string) {
    const [{ count: unreadCount }] = await db
      .select({ count: count() })
      .from(this.table)
      .where(
        and(
          eq(this.table.recipientUserId, userId),
          eq(this.table.status, 'unread'),
        ),
      );
    return unreadCount;
  }

  async getUserNotifications(
    userId: string,
    options: QueryOptions<typeof notifications> & {
      status?: 'unread' | 'read' | 'archived';
      type?: string;
    } = {},
  ) {
    const { page = 1, size = 10, search, status, type } = options;
    const offset = (page - 1) * size;

    const whereConditions = [eq(this.table.recipientUserId, userId)];

    if (status) {
      whereConditions.push(eq(this.table.status, status));
    }

    if (type) {
      whereConditions.push(eq(this.table.type, type as any));
    }

    if (search) {
      whereConditions.push(
        or(
          and(
            isNotNull(this.table.title),
            ilike(this.table.title, `%${search}%`),
          ),
          and(
            isNotNull(this.table.body),
            ilike(this.table.body, `%${search}%`),
          ),
        )!,
      );
    }

    const data = await db.query.notifications.findMany({
      where: and(...whereConditions),
      orderBy: [desc(this.table.createdAt)],
      limit: size,
      offset,
      with: {
        recipient: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(this.table)
      .where(and(...whereConditions));

    return {
      data,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  async markAsRead(id: string, userId: string) {
    const [updated] = await db
      .update(this.table)
      .set({
        status: 'read',
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(this.table.id, id), eq(this.table.recipientUserId, userId)))
      .returning();

    return updated;
  }

  async markAllAsRead(userId: string) {
    const updated = await db
      .update(this.table)
      .set({
        status: 'read',
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(this.table.recipientUserId, userId),
          eq(this.table.status, 'unread'),
        ),
      )
      .returning();

    return updated;
  }

  async getRecentNotifications(userId: string, limit: number = 5) {
    return db.query.notifications.findMany({
      where: eq(this.table.recipientUserId, userId),
      orderBy: [desc(this.table.createdAt)],
      limit,
      with: {
        recipient: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }
}

export const notificationsRepository = new NotificationRepository();
