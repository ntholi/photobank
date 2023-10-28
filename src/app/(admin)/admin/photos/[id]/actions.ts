'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateStatus(
  photoId: string,
  status: 'draft' | 'published' | 'rejected',
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await prisma.photo.update({
    where: { id: photoId },
    data: { status: status },
  });
  revalidatePath(`/admin/photos/${photoId}`);
}
