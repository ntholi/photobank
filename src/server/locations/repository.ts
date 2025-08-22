import BaseRepository from '@/server/base/BaseRepository';
import { locations } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export default class LocationRepository extends BaseRepository<
  typeof locations,
  'id'
> {
  constructor() {
    super(locations, locations.id);
  }

  async upsertByPlaceId(data: {
    placeId: string;
    name: string;
    address?: string | null;
  }) {
    const result = await db
      .insert(locations)
      .values({
        placeId: data.placeId,
        name: data.name,
        address: data.address ?? null,
      })
      .onConflictDoUpdate({
        target: locations.placeId,
        set: {
          name: data.name,
          address: data.address ?? null,
        },
      })
      .returning();

    return result[0];
  }
}

export const locationsRepository = new LocationRepository();
