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

  async isSaved(contentId: string) {
    return withAuth(
      async (session) => {
        const userId = session?.user.id as string | undefined;
        if (!userId) return false;
        const existing = await this.repository.findByUserAndContent(
          userId,
          contentId
        );
        return Boolean(existing);
      },
      ['all']
    );
  }

  async toggle(contentId: string) {
    return withAuth(
      async (session) => {
        const userId = session?.user.id as string;
        return this.repository.toggleByUserAndContent(userId, contentId);
      },
      ['auth']
    );
  }
}

export const savedContentsService = serviceWrapper(
  SavedContentService,
  'SavedContent'
);
