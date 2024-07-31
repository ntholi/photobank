import { thumbnail } from '@/lib/config/urls';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const data = await prisma.photo.findMany({
    where: {
      status: 'published',
    },
    include: {
      user: true,
      location: true,
    },
  });

  const photos = data.map((it) => {
    const fileName = it.fileName.split('.')[0];
    return {
      ...it,
      url: thumbnail(fileName),
    };
  });

  return NextResponse.json({ photos });
}
