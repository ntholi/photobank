import BaseRepository from '@/server/base/BaseRepository';
import { contentTags } from '@/db/schema';

export default class ContentTagRepository extends BaseRepository<
  typeof contentTags,
  'contentId'
> {
  constructor() {
    super(contentTags, contentTags.contentId);
  }
}

export const contentTagsRepository = new ContentTagRepository();
