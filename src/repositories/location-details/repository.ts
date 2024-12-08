import prisma from '@/lib/prisma';
import { Location, LocationDetails, Prisma } from '@prisma/client';

export type LocationDetailsCreate = Omit<LocationDetails, 'locationId'> & {
  location: Location;
};

export default class LocationDetailRepository {
  async findFirst() {
    return await prisma.locationDetails.findFirst();
  }

  async findById(id: string) {
    return await prisma.locationDetails.findUnique({
      where: { id },
      include: {
        location: true,
        coverPhoto: true,
      },
    });
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return await prisma.locationDetails.findMany({
      skip: offset,
      take: limit,
    });
  }

  async search(
    page: number = 1,
    search: string,
    searchProperties: (keyof LocationDetails)[] = [],
    pageSize: number = 15,
  ) {
    try {
      const offset = (page - 1) * pageSize;
      let where = {};

      if (search && search.trim() !== '') {
        where = {
          OR: searchProperties.map((property) => ({
            [property]: {
              contains: search.trim(),
              mode: 'insensitive',
            },
          })),
        };
      }

      const [items, total] = await Promise.all([
        prisma.locationDetails.findMany({
          where,
          skip: offset,
          take: pageSize,
        }),
        prisma.locationDetails.count({ where }),
      ]);

      return {
        items,
        total,
        pages: Math.ceil(total / pageSize),
        currentPage: page,
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to perform search');
    }
  }

  async exists(id: string) {
    const count = await prisma.locationDetails.count({
      where: { id },
    });
    return count > 0;
  }

  async create(data: LocationDetailsCreate) {
    const locationData = await prisma.location.upsert({
      create: {
        id: data.location.id,
        name: data.location.name,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
      },
      update: {},
      where: { id: data.location.id },
    });

    const { id, location, coverPhotoId, ...rest } = data;
    const result = await prisma.locationDetails.create({
      data: {
        ...rest,
        coverPhoto: coverPhotoId
          ? { connect: { id: coverPhotoId } }
          : undefined,
        location: { connect: { id: locationData.id } },
      },
    });
    return result;
  }

  async update(id: string, data: LocationDetails) {
    const { locationId, coverPhotoId, ...rest } = data;
    return await prisma.locationDetails.update({
      where: { id },
      data: {
        about: rest.about,
        coverPhoto: coverPhotoId
          ? { connect: { id: coverPhotoId } }
          : { disconnect: true },
      },
    });
  }

  async delete(id: string) {
    await prisma.locationDetails.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.locationDetails.count();
  }

  async deleteAll() {
    await prisma.locationDetails.deleteMany();
  }
}

export const locationDetailsRepository = new LocationDetailRepository();
