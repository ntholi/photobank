import { content } from '@/db/schema';
import ContentRepository, { ContentFilterOptions } from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type Content = typeof content.$inferInsert;

class ContentService {
  constructor(private readonly repository = new ContentRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), ['all']);
  }

  async getAll(params: QueryOptions<typeof content>) {
    return withAuth(async () => this.repository.query(params), ['all']);
  }

  async create(data: Content) {
    return withAuth(async () => this.repository.create(data), ['contributor']);
  }

  async update(id: string, data: Partial<Content>) {
    return withAuth(
      async () => this.repository.update(id, data),
      ['contributor', 'moderator']
    );
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), ['admin']);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async getContentByTag(
    tagId: string,
    params: QueryOptions<typeof content> = {}
  ) {
    return withAuth(
      async () => this.repository.getContentByTag(tagId, params),
      ['all']
    );
  }

  async getFilteredContent(options: ContentFilterOptions) {
    return withAuth(
      async () => this.repository.getFilteredContent(options),
      ['all']
    );
  }

  async getSimilarContent(contentId: string, limit: number = 20) {
    return withAuth(
      async () => this.repository.getSimilarContent(contentId, limit),
      ['all']
    );
  }

  async getContentWithDetails(id: string) {
    return withAuth(
      async () => this.repository.getContentWithDetails(id),
      ['all']
    );
  }
}

export const contentService = serviceWrapper(ContentService, 'Content');
