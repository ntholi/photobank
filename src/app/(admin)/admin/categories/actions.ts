'use server';

import prisma from '@/lib/db';
import { Category } from '@prisma/client';

export async function createCategory(data: Category) {
  await prisma.category.create({ data });
}

export async function deleteCategory(id: string) {
  console.log('*********** deleteCategory', id);
  // await prisma.category.delete({
  //   where: {
  //     id: Number(id),
  //   },
  // });
}
