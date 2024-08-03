'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Photo } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getPhoto(id: string) {
  return await prisma.photo.findUnique({
    where: {
      id: id,
    },
    include: {
      labels: true,
      user: true,
      location: true,
    },
  });
}

export async function deletePhoto(id: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.photo.delete({ where: { id } });
  revalidatePath('/admin/photos');
}

export async function createPhoto(data: Photo) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return await prisma.photo.create({
    data,
  });
}

export async function updatePhoto(id: string, data: Photo) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return prisma.photo.update({
    where: { id },
    data,
  });
}
