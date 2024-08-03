'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ContributorApplication } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getContributorApplication(id: number) {
  return await prisma.contributorApplication.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
    },
  });
}

export async function deleteContributorApplication(id: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.contributorApplication.delete({ where: { id: Number(id) } });
  revalidatePath('/admin/contributorApplications');
}

export async function createContributorApplication(
  data: ContributorApplication,
) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return await prisma.contributorApplication.create({
    data,
  });
}

export async function updateContributorApplication(
  id: number,
  data: ContributorApplication,
) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return prisma.contributorApplication.update({
    where: { id: Number(id) },
    data,
  });
}
