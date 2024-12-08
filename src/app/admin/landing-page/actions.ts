'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getHomePhotos() {
  return await prisma.homePhoto.findMany({
    select: { id: true, photo: true, order: true },
    orderBy: { order: 'asc' },
  });
}

export async function handleAdd(photoId: string) {
  try {
    await prisma.homePhoto.create({
      data: {
        photoId,
      },
    });
  } catch (e) {
    console.error(e);
  }
  revalidatePath('/admin/landing-page');
  revalidatePath('/');
}

export async function handleDelete(id: number) {
  await prisma.homePhoto.delete({
    where: {
      id,
    },
  });
  revalidatePath('/admin/landing-page');
  revalidatePath('/');
}

export async function handleReorder(activeId: number, overId: number) {
  const photos = await prisma.homePhoto.findMany({
    select: { id: true, order: true },
    orderBy: { order: 'asc' },
  });

  const activeItem = photos.find((p) => p.id === activeId);
  const overItem = photos.find((p) => p.id === overId);

  if (!activeItem || !overItem) return;

  await prisma.$transaction([
    prisma.homePhoto.update({
      where: { id: activeItem.id },
      data: { order: overItem.order },
    }),
    prisma.homePhoto.update({
      where: { id: overItem.id },
      data: { order: activeItem.order },
    }),
  ]);

  revalidatePath('/admin/landing-page');
  revalidatePath('/');
}
