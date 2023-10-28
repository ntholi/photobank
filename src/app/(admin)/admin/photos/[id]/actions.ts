'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateStatus(
  photoId: string,
  status: 'draft' | 'published' | 'rejected',
) {
  await prisma.photo.update({
    where: { id: photoId },
    data: { status: status },
  });
  revalidatePath(`/admin/photos`);
  revalidatePath(`/admin/photos/${photoId}`);
}

export async function updateCaption(photoId: string, caption: string) {
  await prisma.photo.update({
    where: { id: photoId },
    data: { caption: caption },
  });
  revalidatePath(`/admin/photos/${photoId}`);
}

export async function updateLocation(photoId: string, location: string) {
  // await prisma.photo.update({
  //   where: { id: photoId },
  //   data: { location: location },
  // });
  revalidatePath(`/admin/photos/${photoId}`);
}
