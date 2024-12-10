'use server';

import prisma from '@/lib/prisma';

export async function getLocationDetails() {
  return await prisma.locationDetails.findMany({
    where: {
      NOT: {
        tourUrl: null,
      },
    },
    include: {
      location: true,
      coverPhoto: true,
    },
    orderBy: {
      location: {
        name: 'asc',
      },
    },
  });
}
