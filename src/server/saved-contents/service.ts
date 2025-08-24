import { savedContent } from '@/db/schema';
import SavedContentRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type SavedContent = typeof savedContent.$inferInsert;

class SavedContentService {
  constructor(private readonly repository = new SavedContentRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async getAll(params: QueryOptions<typeof savedContent>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: SavedContent) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Partial<SavedContent>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const savedContentsService = serviceWrapper(
  SavedContentService,
  'SavedContent'
);
