import { LocationDetails, Prisma } from '@prisma/client';
import LocationDetailRepository, { LocationDetailsCreate } from './repository';
import withAuth from '@/utils/withAuth';

class LocationDetailService {
  constructor(
    private readonly repository: LocationDetailRepository = new LocationDetailRepository(),
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
    searchProperties: (keyof LocationDetails)[],
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties),
      [],
    );
  }

  async create(data: LocationDetailsCreate) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Prisma.LocationDetailsUpdateInput) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const locationDetailsService = new LocationDetailService();
