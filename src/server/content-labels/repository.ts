import BaseRepository from '@/server/base/BaseRepository';
import { contentLabels } from '@/db/schema';

export default class ContentLabelRepository extends BaseRepository<
  typeof contentLabels,
  'id'
> {
  constructor() {
    super(contentLabels, contentLabels.id);
  }
}

export const contentLabelsRepository = new ContentLabelRepository();
