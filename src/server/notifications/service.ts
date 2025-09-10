import { notifications } from '@/db/schema';
import NotificationRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type Notification = typeof notifications.$inferInsert;

class NotificationService {
  constructor(private readonly repository = new NotificationRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findByIdWithUser(id), []);
  }

  async getAll(params: QueryOptions<typeof notifications>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: Notification) {
    return withAuth(
      async () => this.repository.create(data),
      ['moderator', 'admin'],
    );
  }

  async update(id: string, data: Partial<Notification>) {
    return withAuth(
      async () => this.repository.update(id, data),
      ['moderator', 'admin'],
    );
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async getUserNotifications(
    options: QueryOptions<typeof notifications> & {
      status?: 'unread' | 'read' | 'archived';
      type?: string;
    } = {},
  ) {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required');
        }
        return this.repository.getUserNotifications(session.user.id, options);
      },
      ['all'],
    );
  }

  async getUnreadCount() {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required');
        }
        return this.repository.getUnreadCount(session.user.id);
      },
      ['all'],
    );
  }

  async markAsRead(id: string) {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required');
        }
        return this.repository.markAsRead(id, session.user.id);
      },
      ['all'],
    );
  }

  async markAllAsRead() {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required');
        }
        return this.repository.markAllAsRead(session.user.id);
      },
      ['all'],
    );
  }

  async getRecentNotifications(limit: number = 5) {
    return withAuth(
      async (session) => {
        if (!session?.user?.id) {
          throw new Error('User session required');
        }
        return this.repository.getRecentNotifications(session.user.id, limit);
      },
      ['all'],
    );
  }
}

export const notificationsService = serviceWrapper(
  NotificationService,
  'Notification',
);
