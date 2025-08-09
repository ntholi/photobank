import BaseRepository from '@/server/base/BaseRepository';
import { content } from '@/db/schema';

export default class ContentRepository extends BaseRepository<
  typeof content,
  'id'
> {
  constructor() {
    super(content, 'id');
  }
}

export const contentRepository = new ContentRepository();
