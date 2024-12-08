import { Prisma } from '@prisma/client';
import TagRepository from './repository';
import withAuth from '@/utils/withAuth';

type Tag = Prisma.TagCreateInput;

class TagService {
  constructor(private readonly repository: TagRepository = new TagRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: number) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof Tag)[]
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties),
      []
    );
  }

  async create(data: Tag) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: number, data: Tag) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: number) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const tagsService = new TagService();
