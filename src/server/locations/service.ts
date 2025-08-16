import { locations } from '@/db/schema';
import LocationRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type Location = typeof locations.$inferInsert;

class LocationService {
  constructor(private readonly repository = new LocationRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async getAll(params: QueryOptions<typeof locations>) {
    return withAuth(async () => this.repository.query(params), []);
  }

  async create(data: Location) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Partial<Location>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }

  async upsertByPlaceId(data: {
    placeId: string;
    name: string;
    address?: string | null;
  }) {
    return withAuth(async () => {
      const existing = await this.repository.findById(data.placeId);
      if (existing) return existing;
      const entity: Location = {
        placeId: data.placeId,
        name: data.name,
        address: data.address ?? null,
      };
      return this.repository.create(entity);
    }, ['contributor']);
  }
}

export const locationsService = serviceWrapper(LocationService, 'Location');
