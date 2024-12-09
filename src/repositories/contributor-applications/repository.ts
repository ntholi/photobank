import prisma from '@/lib/prisma';
import { ContributorApplication as Application } from '@prisma/client';

export default class ContributorApplicationRepository {
  async findFirst() {
    return await prisma.contributorApplication.findFirst();
  }

  async findById(id: number) {
    return await prisma.contributorApplication.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findAll(offset: number = 0, limit: number = 10) {
    return await prisma.contributorApplication.findMany({
      skip: offset,
      take: limit,
    });
  }

  async search(
    page: number = 1,
    search: string,
    searchProperties: (keyof Application)[] = [],
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
        prisma.contributorApplication.findMany({
          where,
          skip: offset,
          take: pageSize,
        }),
        prisma.contributorApplication.count({ where }),
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
    const count = await prisma.contributorApplication.count({
      where: { id },
    });
    return count > 0;
  }

  async create(data: Application) {
    return await prisma.contributorApplication.create({
      data,
    });
  }

  async update(id: number, data: Application) {
    return await prisma.contributorApplication.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    await prisma.contributorApplication.delete({
      where: { id },
    });
  }

  async count() {
    return await prisma.contributorApplication.count();
  }

  async deleteAll() {
    await prisma.contributorApplication.deleteMany();
  }
}

export const contributor_applicationsRepository =
  new ContributorApplicationRepository();
