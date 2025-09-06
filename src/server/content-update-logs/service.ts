import { contentUpdateLogs, ContentUpdateAction } from '@/db/schema';
import ContentUpdateLogRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type ContentUpdateLog = typeof contentUpdateLogs.$inferInsert;

class ContentUpdateLogService {
  constructor(private readonly repository = new ContentUpdateLogRepository()) {}

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), ['moderator']);
  }

  async getAll(params: QueryOptions<typeof contentUpdateLogs>) {
    return withAuth(async () => this.repository.query(params), ['moderator']);
  }

  async getByContentId(contentId: string, page: number = 1, size: number = 20) {
    return withAuth(
      async () => this.repository.getByContentId(contentId, page, size),
      ['moderator'],
    );
  }

  async getByUserId(userId: string, page: number = 1, size: number = 20) {
    return withAuth(
      async () => this.repository.getByUserId(userId, page, size),
      ['moderator'],
    );
  }

  async logUpdate(
    contentId: string,
    userId: string,
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
  ) {
    return withAuth(async () => {
      const logData: ContentUpdateLog = {
        contentId,
        userId,
        action: 'update' as ContentUpdateAction,
        oldValues,
        newValues,
      };

      return this.repository.create(logData);
    }, ['contributor']);
  }

  async logDelete(
    contentId: string,
    userId: string,
    deletedValues: Record<string, unknown>,
  ) {
    return withAuth(async () => {
      const logData: ContentUpdateLog = {
        contentId,
        userId,
        action: 'delete' as ContentUpdateAction,
        oldValues: deletedValues,
        newValues: null,
      };

      return this.repository.create(logData);
    }, ['contributor']);
  }

  async count() {
    return withAuth(async () => this.repository.count(), ['moderator']);
  }
}

export const contentUpdateLogService = serviceWrapper(
  ContentUpdateLogService,
  'ContentUpdateLog',
);
