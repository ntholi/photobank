'use server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ContributorApplication } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getApplication(id: number) {
  return await prisma.contributorApplication.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
    },
  });
}

export async function deleteApplication(id: number) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');
  await prisma.contributorApplication.delete({ where: { id: Number(id) } });
  revalidatePath('/admin/contributorApplications');
}

export async function createApplication(data: ContributorApplication) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  return await prisma.contributorApplication.create({
    data,
  });
}

export async function updateApplicationStatus(
  id: number,
  userId: string,
  status: ContributorApplication['status'],
) {
  const session = await auth();
  if (session?.user?.role != 'admin') throw new Error('User not admin');

  await prisma.contributorApplication.update({
    where: { id: Number(id) },
    data: { status },
  });
  if (status === 'approved') {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'contributor' },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'user' },
    });
  }

  revalidatePath(`/admin/contributor-applications/${id}`);
}
