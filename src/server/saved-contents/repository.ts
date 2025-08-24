import BaseRepository from '@/server/base/BaseRepository';
import { db } from '@/db';
import { savedContent } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export default class SavedContentRepository extends BaseRepository<
  typeof savedContent,
  'id'
> {
  constructor() {
    super(savedContent, savedContent.id);
  }

  async findByUserAndContent(userId: string, contentId: string) {
    const result = await db
      .select()
      .from(savedContent)
      .where(
        and(
          eq(savedContent.userId, userId),
          eq(savedContent.contentId, contentId)
        )
      )
      .limit(1);
    return result[0] ?? null;
  }

  async deleteByUserAndContent(userId: string, contentId: string) {
    const result = await db
      .delete(savedContent)
      .where(
        and(
          eq(savedContent.userId, userId),
          eq(savedContent.contentId, contentId)
        )
      )
      .returning();
    return result.length > 0;
  }

  async toggleByUserAndContent(userId: string, contentId: string) {
    const id = nanoid();
    const result: any = await db.execute(sql`
      with ins as (
        insert into saved_contents (id, user_id, content_id, created_at, updated_at)
        values (${id}, ${userId}, ${contentId}, now(), now())
        on conflict (user_id, content_id) do nothing
        returning 1
      ),
      del as (
        delete from saved_contents
        where user_id = ${userId} and content_id = ${contentId} and not exists (select 1 from ins)
        returning 1
      )
      select coalesce((select count(1) from ins), 0) as inserted,
             coalesce((select count(1) from del), 0) as deleted
    `);
    const row = Array.isArray(result?.rows) ? result.rows[0] : result[0];
    const inserted = Number(row?.inserted ?? 0);
    return { saved: inserted > 0 } as const;
  }
}

export const savedContentsRepository = new SavedContentRepository();
