'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Location, LocationDetails, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type LocationDetailsFormData = LocationDetails & {
  location: Location | null;
};

function hasAccess(role?: Role) {
  if (!role) return false;
  const roles = ['admin', 'moderator'];
  return roles.includes(role);
}

export async function getLocation(id: string) {
  return await prisma.location.findUnique({
    where: { id },
  });
}

export async function deleteLocation(id: string) {
  const session = await auth();
  if (hasAccess(session?.user?.role)) throw new Error('User not admin');
  await prisma.location.delete({ where: { id } });
  revalidatePath('/admin/locations');
}

export async function createLocation(
  data: LocationDetails,
  location: Location,
) {
  const session = await auth();
  if (!hasAccess(session?.user?.role)) throw new Error('User not admin');

  const locationData = await prisma.location.upsert({
    create: location,
    update: {},
    where: { id: location.id },
  });

  const { locationId, coverPhotoId, ...rest } = data;
  return await prisma.locationDetails.create({
    data: {
      ...rest,
      location: { connect: { id: locationData.id } },
    },
  });
}

export async function updateLocation(id: string, data: Location) {
  const session = await auth();
  if (hasAccess(session?.user?.role)) throw new Error('User not admin');

  return prisma.location.update({
    where: { id },
    data,
  });
}
