import { thumbnail } from '@/lib/config/urls';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const data = await prisma.photo.findManyRandom(7, {
    where: {
      status: 'published',
      useWithoutWatermark: true,
    },
    select: {
      fileName: true,
      id: true,
      user: true,
      location: true,
    },
  });

  const photos = data.map((photo) => {
    if (typeof photo.fileName === 'string') {
      const fileName = (photo.fileName as string).split('.')[0];
      return {
        ...photo,
        url: thumbnail(fileName),
      };
    }
  });
  return NextResponse.json({ photos });
}
