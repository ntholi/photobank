'use server';

import prisma from '@/lib/prisma';
import { updateLocationDetail } from '../location-details/actions';
import { getLocationDetail } from '../location-details/actions';

export async function saveVirtualTour(id: string, tourUrl: string) {
  const locationDetails = await getLocationDetail(id);
  if (!locationDetails) throw new Error('Location not found');

  return await updateLocationDetail(id, {
    ...locationDetails,
    tourUrl,
  });
}

export async function getLocationsWithTour() {
  const items = await prisma.locationDetails.findMany({
    where: { tourUrl: { not: null } },
    include: { location: true },
  });
  return { items, pages: 1 };
}

export async function getLocationDetailsWithoutTour() {
  return await prisma.locationDetails.findMany({
    where: { tourUrl: null },
    include: { location: true },
  });
}
