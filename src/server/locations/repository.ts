import BaseRepository from '@/server/base/BaseRepository';
import { locations, content, locationDetails } from '@/db/schema';
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

  async updateLocationDetails(
    locationId: string,
    data: { coverContentId?: string | null; about?: string }
  ) {
    await db
      .insert(locationDetails)
      .values({
        locationId,
        coverContentId: data.coverContentId,
        about: data.about,
      })
      .onConflictDoUpdate({
        target: locationDetails.locationId,
        set: {
          coverContentId: data.coverContentId,
          about: data.about,
        },
      });

    const result = await db
      .select()
      .from(locationDetails)
      .where(eq(locationDetails.locationId, locationId))
      .limit(1);

    return result[0];
  }

  async findByIdWithCoverContent(id: string) {
    const location = await this.findById(id);
    if (!location) return null;

    const locationDetail = await db
      .select()
      .from(locationDetails)
      .where(eq(locationDetails.locationId, id))
      .limit(1)
      .then(([result]) => result || null);

    if (!locationDetail) {
      return { ...location, coverContent: null, about: null };
    }

    let coverContent = null;
    if (locationDetail.coverContentId) {
      coverContent = await db
        .select()
        .from(content)
        .where(eq(content.id, locationDetail.coverContentId))
        .limit(1)
        .then(([result]) => result || null);
    }

    return {
      ...location,
      coverContent,
      about: locationDetail.about || null,
    };
  }
}

export const locationsRepository = new LocationRepository();
