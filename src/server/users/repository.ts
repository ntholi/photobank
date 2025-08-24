import BaseRepository from '@/server/base/BaseRepository';
import { users, content, savedContent } from '@/db/schema';
import { db } from '@/db';
import { eq, sql } from 'drizzle-orm';

export default class UserRepository extends BaseRepository<typeof users, 'id'> {
  constructor() {
    super(users, users.id);
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
