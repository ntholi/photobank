'use server';

import { Prisma } from '@prisma/client';

import { locationDetailsService } from '@/repositories/location-details/service';

type LocationDetail = Prisma.LocationDetailsCreateInput;

export async function getLocationDetail(id: string) {
  return locationDetailsService.get(id);
}

export async function getAllLocationDetails(page: number = 1, search = '') {
  return locationDetailsService.search(page, search, []);
}

export async function createLocationDetail(locationDetail: LocationDetail) {
  return locationDetailsService.create(locationDetail);
}

export async function updateLocationDetail(
  id: string,
  locationDetail: LocationDetail,
) {
  return locationDetailsService.update(id, locationDetail);
}

export async function deleteLocationDetail(id: string) {
  return locationDetailsService.delete(id);
}
