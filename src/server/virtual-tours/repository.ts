import BaseRepository from '@/server/base/BaseRepository';
import { virtualTours } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export default class VirtualTourRepository extends BaseRepository<
  typeof virtualTours,
  'id'
> {
  constructor() {
    super(virtualTours, virtualTours.id);
  }

  async findWithLocation(id: string) {
    return db.query.virtualTours.findFirst({
      where: eq(virtualTours.id, id),
      with: {
        location: true,
      },
    });
  }
}

export const virtualToursRepository = new VirtualTourRepository();
