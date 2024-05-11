'use server';

import prisma from '@/lib/db';
import { Category } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createCategory(data: Category) {
  const { id } = await prisma.category.create({ data });
  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}`);
}

export async function updateCategory(id: string, data: Category) {
  await prisma.category.update({
    where: {
      id: Number(id),
    },
    data,
  });
  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}`);
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
  revalidatePath('/admin/categories');
}
