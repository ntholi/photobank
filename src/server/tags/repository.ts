import BaseRepository from '@/server/base/BaseRepository';
import { tags, contentTags } from '@/db/schema';
import { db } from '@/db';
import { count, desc, eq } from 'drizzle-orm';

export default class TagRepository extends BaseRepository<typeof tags, 'id'> {
  constructor() {
    super(tags, tags.id);
  }

  async getPopularTags() {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        createdAt: tags.createdAt,
        contentCount: count(contentTags.tagId),
      })
      .from(tags)
      .leftJoin(contentTags, eq(tags.id, contentTags.tagId))
      .groupBy(tags.id, tags.name, tags.slug, tags.createdAt)
      .orderBy(desc(count(contentTags.tagId)), desc(tags.createdAt));

    return result;
  }
}

export const tagsRepository = new TagRepository();
