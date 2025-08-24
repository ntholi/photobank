'use server';


import { virtualTours } from '@/db/schema';
import { virtualToursService as service} from './service';

type VirtualTour = typeof virtualTours.$inferInsert;


export async function getVirtualTour(id: string) {
  return service.get(id);
}

export async function getVirtualTours(page: number = 1, search = '') {
  return service.getAll({ page, search });
}

export async function createVirtualTour(virtualTour: VirtualTour) {
  return service.create(virtualTour);
}

export async function updateVirtualTour(id: string, virtualTour: Partial<VirtualTour>) {
  return service.update(id, virtualTour);
}

export async function deleteVirtualTour(id: string) {
  return service.delete(id);
}