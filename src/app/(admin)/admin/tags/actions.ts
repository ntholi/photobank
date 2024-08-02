'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Label, Tag } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getTag(id: number) {
  return await prisma.tag.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      labels: true,
    },
  });
}

export async function deleteTag(id: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.tag.delete({ where: { id: Number(id) } });
  revalidatePath('/admin/tags');
}

export async function createTag(tag: Tag & { labels: Label[] }) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  const { labels, ...data } = tag;
  return await prisma.tag.create({
    data: {
      ...data,
      labels: {
        create: labels,
      },
    },
  });
}

export async function updateTag(id: number, data: Tag & { labels: Label[] }) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  const { labels, ...tagData } = data;

  // First, fetch the current labels
  const currentTag = await prisma.tag.findUnique({
    where: { id: Number(id) },
    include: { labels: true },
  });

  if (!currentTag) {
    throw new Error('Tag not found');
  }

  const currentLabelIds = new Set(currentTag.labels.map((l) => l.id));
  const newLabelIds = new Set(labels.map((l) => l.id));

  return prisma.tag.update({
    where: { id: Number(id) },
    data: {
      ...tagData,
      labels: {
        disconnect: currentTag.labels
          .filter((label) => !newLabelIds.has(label.id))
          .map((label) => ({ id: label.id })),
        connectOrCreate: labels.map((label) => ({
          where: { id: label.id },
          create: { name: label.name },
        })),
      },
    },
    include: { labels: true },
  });
}
