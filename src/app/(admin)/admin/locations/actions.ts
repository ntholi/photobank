'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Location } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getLocation(id: string) {
  return await prisma.location.findUnique({
    where: { id },
  });
}

export async function deleteLocation(id: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.location.delete({ where: { id } });
  revalidatePath('/admin/locations');
}

export async function createLocation(data: Location) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return await prisma.location.create({
    data,
  });
}

export async function updateLocation(id: string, data: Location) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return prisma.location.update({
    where: { id },
    data,
  });
}
