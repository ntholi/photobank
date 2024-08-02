'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Tag } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getTag(id: number) {
  return await prisma.tag.findUnique({
    where: {
      id: Number(id),
    },
  });
}

export async function deleteTag(id: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.tag.delete({ where: { id: Number(id) } });
  revalidatePath('/admin/tags');
}

export async function createTag(data: Tag) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return await prisma.tag.create({
    data,
  });
}

export async function updateTag(id: number, data: Tag) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return prisma.tag.update({
    where: { id: Number(id) },
    data,
  });
}
