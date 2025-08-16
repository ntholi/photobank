import BaseRepository from '@/server/base/BaseRepository';
import { locations } from '@/db/schema';

export default class LocationRepository extends BaseRepository<
  typeof locations,
  'id'
> {
  constructor() {
    super(locations, locations.id);
  }
}

export const locationsRepository = new LocationRepository();
