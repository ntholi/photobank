'use server';

import prisma from '@/lib/prisma';
import withAuth from '@/utils/withAuth';
import { Content } from '@prisma/client';

export async function getContent(slug: string) {
  return withAuth(async () => {
    return await prisma.content.findFirst({
      where: {
        slug,
      },
    });
  });
}

export async function saveContent(slug: string, values: Content) {
  return withAuth(async () => {
    return await prisma.content.upsert({
      where: { slug },
      update: values,
      create: { ...values, slug },
    });
  });
}
