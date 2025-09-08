import BaseRepository from '@/server/base/BaseRepository';
import { notifications } from '@/db/schema';
import { db } from '@/db';
import { count, and, eq } from 'drizzle-orm';

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
}

export const notificationsRepository = new NotificationRepository();
