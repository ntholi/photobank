'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Tag } from '@prisma/client';

export async function deleteTag(id: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  prisma.tag.delete({ where: { id } });
}

export async function createTag(data: Tag) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return prisma.tag.create({
    data: {
      ...data,
    },
  });
}
