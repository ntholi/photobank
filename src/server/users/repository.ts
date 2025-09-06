import BaseRepository from '@/server/base/BaseRepository';
import { users, content, savedContent } from '@/db/schema';
import { db } from '@/db';
import { eq, sql } from 'drizzle-orm';

export default class UserRepository extends BaseRepository<typeof users, 'id'> {
  constructor() {
    super(users, users.id);
  }

  async getUserWithStats(userId: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        bio: users.bio,
        website: users.website,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        uploadCount: sql<number>`COALESCE(COUNT(DISTINCT ${content.id}), 0)`,
        savedCount: sql<number>`COALESCE(COUNT(DISTINCT ${savedContent.id}), 0)`,
      })
      .from(users)
      .leftJoin(content, eq(content.userId, users.id))
      .leftJoin(savedContent, eq(savedContent.userId, users.id))
      .where(eq(users.id, userId))
      .groupBy(users.id)
      .limit(1);

    const userWithStats = result[0];
    if (!userWithStats) return null;

    return {
      id: userWithStats.id,
      name: userWithStats.name,
      role: userWithStats.role,
      bio: userWithStats.bio,
      website: userWithStats.website,
      email: userWithStats.email,
      emailVerified: userWithStats.emailVerified,
      image: userWithStats.image,
      stats: {
        uploads: userWithStats.uploadCount,
        saved: userWithStats.savedCount,
      },
    };
  }

  async getUserUploadCount(userId: string) {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(content)
      .where(eq(content.userId, userId));

    return countResult[0]?.count ?? 0;
  }

  async getUserSavedCount(userId: string) {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedContent)
      .where(eq(savedContent.userId, userId));

    return countResult[0]?.count ?? 0;
  }
}

export const usersRepository = new UserRepository();
