'use server';

import { auth } from '@/auth';

import { Prisma } from '@prisma/client';


type Role = Prisma.UserCreateInput['role'];

export default async function withAuth<T>(
  fn: () => Promise<T>,
  roles: Role[] = [],
) {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!['admin', ...roles].includes(session?.user?.role)) {
    throw new Error('Unauthorized');
  }

  return await fn();
}