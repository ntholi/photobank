import withAuth from '@/server/base/withAuth';
import { serviceWrapper } from '@/server/base/serviceWrapper';
import LocationsRepository from './repository';
import { locations } from '@/db/schema';

type LocationInsert = typeof locations.$inferInsert;

class LocationsService {
  constructor(private readonly repository = new LocationsRepository()) {}

  async get(id: string) {
    return withAuth(async () => this.repository.findById(id), ['all']);
  }

  async getByPlaceId(placeId: string) {
    return withAuth(
      async () => this.repository.findByPlaceId(placeId),
      ['all']
    );
  }

  async upsertByPlaceId(data: {
    placeId: string;
    name: string;
    formattedAddress?: string | null;
  }) {
    return withAuth(async () => {
      const existing = await this.repository.findByPlaceId(data.placeId);
      if (existing) return existing;
      const entity: LocationInsert = {
        placeId: data.placeId,
        name: data.name,
        formattedAddress: data.formattedAddress ?? null,
      };
      return this.repository.create(entity);
    }, ['contributor']);
  }
}

export const locationsService = serviceWrapper(LocationsService, 'Locations');
