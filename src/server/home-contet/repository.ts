import BaseRepository from '@/server/base/BaseRepository';
import { homeContent } from '@/db/schema';

export default class HomeContentRepository extends BaseRepository<
  typeof homeContent,
  'id'
> {
  constructor() {
    super(homeContent, homeContent.id);
  }
}

export const homeContentRepository = new HomeContentRepository();
