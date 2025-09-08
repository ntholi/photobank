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
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Partial<Notification>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const notificationsService = serviceWrapper(
  NotificationService,
  'Notification',
);
