'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Update } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getUpdate(id: number) {
  return await prisma.update.findUnique({
    where: {
      id: Number(id),
    },
  });
}

export async function deleteUpdate(id: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.update.delete({ where: { id: Number(id) } });
  revalidatePath('/admin/updates');
}

export async function createUpdate(data: Update) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return await prisma.update.create({
    data,
  });
}

export async function updateUpdate(id: number, data: Update) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return prisma.update.update({
    where: { id: Number(id) },
    data,
  });
}
