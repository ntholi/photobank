'use server';

import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function blockUser(id: string, blocked: boolean) {
  const res = await prisma.user.update({
    where: { id },
    data: { blocked: blocked },
  });
  revalidatePath('/admin/users');
  return res.blocked === blocked;
}

export async function updateRole(id: string, role: Role) {
  const res = await prisma.user.update({
    where: { id },
    data: { role },
  });
  revalidatePath('/admin/users');
  return res.role === role;
}
