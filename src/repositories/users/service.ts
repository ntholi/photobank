import { Prisma } from '@prisma/client';
import UserRepository from './repository';
import withAuth from '@/utils/withAuth';

type User = Prisma.UserCreateInput;

class UserService {
  constructor(private readonly repository: UserRepository = new UserRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof User)[]
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties),
      []
    );
  }

  async create(data: User) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: User) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const usersService = new UserService();
