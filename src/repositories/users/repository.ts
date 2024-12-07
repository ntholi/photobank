import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type User = Prisma.UserCreateInput;

export default class UserRepository {
  async findFirst() {
    return await prisma.user.findFirst();
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return await prisma.user.findMany({
      skip: offset,
      take: limit,
    });
  }

  async search(
    page: number = 1,
    search: string,
    searchProperties: (keyof User)[] = [],
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
        prisma.user.findMany({
          where,
          skip: offset,
          take: pageSize,
        }),
        prisma.user.count({ where }),
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
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.user.count();
  }

  async deleteAll() {
    await prisma.user.deleteMany();
  }
}

export const usersRepository = new UserRepository();
