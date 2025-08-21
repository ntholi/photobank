import { homeContent } from '@/db/schema';
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
}

export const homeContentService = serviceWrapper(
  HomeContentService,
  'HomeContent'
);
