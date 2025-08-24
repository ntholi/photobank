import BaseRepository from '@/server/base/BaseRepository';
import { virtualTours } from '@/db/schema';

export default class VirtualTourRepository extends BaseRepository<
  typeof virtualTours,
  'id'
> {
  constructor() {
    super(virtualTours, virtualTours.id);
  }
}

export const virtualToursRepository = new VirtualTourRepository();
