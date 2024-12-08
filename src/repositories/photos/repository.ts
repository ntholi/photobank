import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type Photo = Prisma.PhotoCreateInput;

export default class PhotoRepository {
  async findFirst() {
    return await prisma.photo.findFirst();
  }

  async findById(id: string) {
    return await prisma.photo.findUnique({
      where: { id },
    });
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return await prisma.photo.findMany({
      skip: offset,
      take: limit,
    });
  }

  async search(
    page: number = 1,
    search: string,
    searchProperties: (keyof Photo)[] = [],
    pageSize: number = 15
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
        prisma.photo.findMany({
          where,
          skip: offset,
          take: pageSize,
        }),
        prisma.photo.count({ where }),
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
    const count = await prisma.photo.count({
      where: { id },
    });
    return count > 0;
  }

  async create(data: Prisma.PhotoCreateInput) {
    return await prisma.photo.create({
      data,
    });
  }

  async update(id: string, data: Prisma.PhotoUpdateInput) {
    return await prisma.photo.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.photo.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.photo.count();
  }

  async deleteAll() {
    await prisma.photo.deleteMany();
  }
}

export const photosRepository = new PhotoRepository();
