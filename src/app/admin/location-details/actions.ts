'use server';

import { Prisma } from '@prisma/client';

import { locationDetailsService } from '@/repositories/location-details/service';
import { LocationDetailsCreate } from '@/repositories/location-details/repository';

type LocationDetail = Prisma.LocationDetailsCreateInput;

export async function getLocationDetail(id: string) {
  return locationDetailsService.get(id);
}

export async function getAllLocationDetails(page: number = 1, search = '') {
  return locationDetailsService.search(page, search, []);
}

export async function createLocationDetail(data: LocationDetailsCreate) {
  return locationDetailsService.create(data);
}

export async function updateLocationDetail(id: string, data: LocationDetail) {
  return locationDetailsService.update(id, data);
}

export async function deleteLocationDetail(id: string) {
  return locationDetailsService.delete(id);
}
