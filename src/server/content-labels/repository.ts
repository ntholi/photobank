import { contentLabels } from '@/db/schema';
import BaseRepository from '../base/BaseRepository';

class ContentLabelsRepository extends BaseRepository<
  typeof contentLabels,
  'id'
> {
  constructor() {
    super(contentLabels, contentLabels.id);
  }

  async findByContentId(contentId: string) {
    return this.query({
      filter: this.eq('contentId', contentId),
    });
  }

  async deleteByContentId(contentId: string) {
    return this.db.delete(this.table).where(this.eq('contentId', contentId));
  }
}

export default ContentLabelsRepository;
