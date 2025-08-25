import BaseRepository from '@/server/base/BaseRepository';
import {
  locations,
  content,
  locationDetails,
  locationCoverContents,
} from '@/db/schema';
import { db } from '@/db';
import { asc, eq, sql } from 'drizzle-orm';

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
    latitude: number;
    longitude: number;
  }) {
    const result = await db
      .insert(locations)
      .values({
        placeId: data.placeId,
        name: data.name,
        address: data.address ?? null,
        latitude: data.latitude,
        longitude: data.longitude,
      })
      .onConflictDoUpdate({
        target: locations.placeId,
        set: {
          name: data.name,
          address: data.address ?? null,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      })
      .returning();

    return result[0];
  }

  async updateLocationDetails(
    locationId: string,
    data: { coverContentIds?: string[]; about?: string },
  ) {
    await db
      .insert(locationDetails)
      .values({
        locationId,
        about: data.about,
      })
      .onConflictDoUpdate({
        target: locationDetails.locationId,
        set: {
          about: data.about,
        },
      });

    if (data.coverContentIds) {
      await db
        .delete(locationCoverContents)
        .where(eq(locationCoverContents.locationId, locationId));

      if (data.coverContentIds.length > 0) {
        const rows = data.coverContentIds.map((contentId, index) => ({
          locationId,
          contentId,
          position: index,
        }));
        await db.insert(locationCoverContents).values(rows);
      }
    }

    const details = await db.query.locationDetails.findFirst({
      where: eq(locationDetails.locationId, locationId),
    });

    const covers = await db.query.locationCoverContents.findMany({
      where: eq(locationCoverContents.locationId, locationId),
      with: { content: true },
      orderBy: asc(locationCoverContents.position),
    });

    return { ...details, coverContents: covers.map((c) => c.content) } as const;
  }

  async findByIdWithCover(id: string) {
    const result = await db.query.locations.findFirst({
      where: eq(locations.id, id),
      with: {
        content: true,
        details: true,
        virtualTour: true,
        coverContents: {
          with: { content: true },
          orderBy: asc(locationCoverContents.position),
        },
      },
    });

    if (!result) return null;
    const coverContents = (result.coverContents || []).map((r) => r.content);

    return {
      ...result,
      coverContent: coverContents[0] || null,
      coverContents,
      about: result.details?.about || null,
      virtualTourUrl: result.virtualTour?.url || null,
    } as const;
  }

  async findByIdWithCoverContent(id: string) {
    const result = await db.query.locations.findFirst({
      where: eq(locations.id, id),
      with: {
        details: true,
        virtualTour: true,
        coverContents: {
          with: { content: true },
          orderBy: asc(locationCoverContents.position),
        },
      },
    });

    if (!result) return null;
    const coverContents = (result.coverContents || []).map((r) => r.content);

    return {
      ...result,
      coverContent: coverContents[0] || null,
      coverContents,
      about: result.details?.about || null,
      virtualTourUrl: result.virtualTour?.url || null,
    } as const;
  }

  async getTopByContentCount(limit: number = 20) {
    const rows = await db
      .select({
        id: locations.id,
        name: locations.name,
        latitude: locations.latitude,
        longitude: locations.longitude,
        count: sql<number>`count(*)`,
      })
      .from(content)
      .innerJoin(locations, eq(content.locationId, locations.id))
      .where(eq(content.status, 'published'))
      .groupBy(
        locations.id,
        locations.name,
        locations.latitude,
        locations.longitude,
      )
      .orderBy(sql`count(*) DESC`)
      .limit(limit);

    return rows;
  }
}

export const locationsRepository = new LocationRepository();
