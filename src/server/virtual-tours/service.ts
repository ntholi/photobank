import { virtualTours } from '@/db/schema';
import VirtualTourRepository from './repository';
import withAuth from '@/server/base/withAuth';
import { QueryOptions } from '../base/BaseRepository';
import { serviceWrapper } from '../base/serviceWrapper';

type VirtualTour = typeof virtualTours.$inferInsert;

class VirtualTourService {
  constructor(private readonly repository = new VirtualTourRepository()) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: string) {
    return withAuth(async () => this.repository.findWithLocation(id), ['all']);
  }

  async getAll(params: QueryOptions<typeof virtualTours>) {
    return withAuth(async () => this.repository.query(params), ['all']);
  }

  async create(data: VirtualTour) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: string, data: Partial<VirtualTour>) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: string) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export const virtualToursService = serviceWrapper(
  VirtualTourService,
  'VirtualTour',
);
