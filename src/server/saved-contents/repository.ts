import BaseRepository from '@/server/base/BaseRepository';
import { savedContent } from '@/db/schema';

export default class SavedContentRepository extends BaseRepository<
  typeof savedContent,
  'id'
> {
  constructor() {
    super(savedContent, savedContent.id);
  }
}

export const savedContentsRepository = new SavedContentRepository();
