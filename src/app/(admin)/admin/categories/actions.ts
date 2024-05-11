'use server';

import prisma from '@/lib/db';
import { Category } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createCategory(data: Category) {
  const { id } = await prisma.category.create({ data });
  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}`);
}

export async function deleteCategory(id: string) {
  console.log('*********** deleteCategory', id);
  // await prisma.category.delete({
  //   where: {
  //     id: Number(id),
  //   },
  // });
}
