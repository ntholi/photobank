import BaseRepository from '@/server/base/BaseRepository';
import { locations } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export default class LocationsRepository extends BaseRepository<
  typeof locations,
  'id'
> {
  constructor() {
    super(locations, locations.id);
  }

  async findByPlaceId(placeId: string) {
    const [result] = await db
      .select({
        id: locations.id,
        placeId: locations.placeId,
        name: locations.name,
        address: locations.address,
      })
      .from(locations)
      .where(eq(locations.placeId, placeId))
      .limit(1);
    return result;
  }
}

export const locationsRepository = new LocationsRepository();
