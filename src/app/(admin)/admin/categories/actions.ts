'use server';

import prisma from '@/lib/db';

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
}
