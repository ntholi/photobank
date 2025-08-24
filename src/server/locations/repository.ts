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

  async findByIdWithCover(id: string) {
    const result = await db.query.locations.findFirst({
      where: eq(locations.id, id),
      with: {
        content: true,
        details: {
          with: {
            coverContent: true,
          },
        },
      },
    });

    if (!result) return null;

    return {
      ...result,
      coverContent: result.details?.coverContent || null,
      about: result.details?.about || null,
    };
  }

  async findByIdWithCoverContent(id: string) {
    const result = await db.query.locations.findFirst({
      where: eq(locations.id, id),
      with: {
        details: {
          with: {
            coverContent: true,
          },
        },
      },
    });

    if (!result) return null;

    return {
      ...result,
      coverContent: result.details?.coverContent || null,
      about: result.details?.about || null,
    };
  }
}

export const locationsRepository = new LocationRepository();
