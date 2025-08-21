import { recognitionLabels } from '@/db/schema';
import BaseRepository from '../base/BaseRepository';

class RecognitionLabelsRepository extends BaseRepository<
  typeof recognitionLabels,
  'id'
> {
  constructor() {
    super(recognitionLabels, recognitionLabels.id);
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

export default RecognitionLabelsRepository;
