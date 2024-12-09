import withAuth from '@/utils/withAuth';
import { ContributorApplication as Application } from '@prisma/client';
import ContributorApplicationRepository from './repository';

class ContributorApplicationService {
  constructor(
    private readonly repository = new ContributorApplicationRepository(),
  ) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: number) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof Application)[],
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties),
      [],
    );
  }

  async create(data: Application) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: number, data: Application) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: number) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const contributorApplicationsService =
  new ContributorApplicationService();
