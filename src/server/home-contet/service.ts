import { homeContent, content } from '@/db/schema';
import HomeContentRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type HomeContent = typeof homeContent.$inferInsert;

class HomeContentService {
  constructor(private readonly repository = new HomeContentRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async getAll(params: QueryOptions<typeof homeContent>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: HomeContent) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Partial<HomeContent>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async getAllWithDetails() {
    return withAuth(async () => this.repository.getAllWithDetails(), ['all']);
  }

  async addContentToHome(contentIds: string[]) {
    return withAuth(async () => {
      const result = await this.repository.addContentToHome(contentIds);
      return result;
    }, ['moderator', 'admin']);
  }

  async removeContentFromHome(contentId: string) {
    return withAuth(async () => {
      const result = await this.repository.removeContentFromHome(contentId);
      return result;
    }, ['moderator', 'admin']);
  }

  async updateOrder(items: { id: string; position: number }[]) {
    return withAuth(async () => {
      const result = await this.repository.updateOrder(items);
      return result;
    }, ['moderator', 'admin']);
  }
}

export const homeContentService = serviceWrapper(
  HomeContentService,
  'HomeContent'
);
