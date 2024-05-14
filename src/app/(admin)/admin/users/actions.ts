'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function blockUser(id: string, blocked: boolean) {
  const res = await prisma.user.update({
    where: { id },
    data: { blocked: blocked },
  });
  revalidatePath('/admin/users');
  return res.blocked === blocked;
}
