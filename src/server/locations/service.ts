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
      return this.repository.upsertByPlaceId(data);
    }, ['contributor']);
  }

  async updateLocationDetails(
    locationId: string,
    data: { coverContentId?: string | null; about?: string }
  ) {
    return withAuth(async () => {
      return this.repository.updateLocationDetails(locationId, data);
    }, ['contributor']);
  }

  async getWithCover(id: string) {
    return withAuth(async () => {
      return this.repository.findByIdWithCover(id);
    }, []);
  }
}

export const locationsService = serviceWrapper(LocationService, 'Location');
