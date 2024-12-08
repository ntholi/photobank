import { Prisma } from '@prisma/client';
import PhotoRepository from './repository';
import withAuth from '@/utils/withAuth';

type Photo = Prisma.PhotoCreateInput;

class PhotoService {
  constructor(
    private readonly repository: PhotoRepository = new PhotoRepository(),
  ) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof Photo)[],
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties),
      [],
    );
  }

  async create(data: Photo) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Photo) {
    return withAuth(
      async () => this.repository.update(id, data),
      ['moderator'],
    );
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const photosService = new PhotoService();
