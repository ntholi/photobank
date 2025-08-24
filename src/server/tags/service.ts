import { tags } from '@/db/schema';
import TagRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';
import { slugify } from '@/lib/utils';

type Tag = typeof tags.$inferInsert;

class TagService {
  constructor(private readonly repository = new TagRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async getAll(params: QueryOptions<typeof tags>) {
    return withAuth(async () => this.repository.query(params), ['all']);
  }

  async create(data: Tag) {
    return withAuth(
      async () => this.repository.create({ ...data, slug: slugify(data.name) }),
      []
    );
  }

  async update(id: string, data: Partial<Tag>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async getPopularTags() {
    return withAuth(async () => this.repository.getPopularTags(), ['all']);
  }
}

export const tagsService = serviceWrapper(TagService, 'Tag');
