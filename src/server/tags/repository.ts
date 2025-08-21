import BaseRepository from '@/server/base/BaseRepository';
import { tags } from '@/db/schema';

export default class TagRepository extends BaseRepository<typeof tags, 'id'> {
  constructor() {
    super(tags, tags.id);
  }
}

export const tagsRepository = new TagRepository();
