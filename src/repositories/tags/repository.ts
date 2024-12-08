import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type Tag = Prisma.TagCreateInput;

export default class TagRepository {
  async findFirst() {
    return await prisma.tag.findFirst();
  }

  async findById(id: number) {
    return await prisma.tag.findUnique({
      where: { id },
    });
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return await prisma.tag.findMany({
      skip: offset,
      take: limit,
    });
  }

  async search(
    page: number = 1,
    search: string,
    searchProperties: (keyof Tag)[] = [],
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
        prisma.tag.findMany({
          where,
          skip: offset,
          take: pageSize,
        }),
        prisma.tag.count({ where }),
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

  async exists(id: number) {
    const count = await prisma.tag.count({
      where: { id },
    });
    return count > 0;
  }

  async create(data: Prisma.TagCreateInput) {
    return await prisma.tag.create({
      data,
    });
  }

  async update(id: number, data: Prisma.TagUpdateInput) {
    return await prisma.tag.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    await prisma.tag.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.tag.count();
  }

  async deleteAll() {
    await prisma.tag.deleteMany();
  }
}

export const tagsRepository = new TagRepository();
