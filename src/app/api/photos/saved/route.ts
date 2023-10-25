import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { thumbnail } from '@/lib/config/urls';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || '';

  const items = await prisma.savedPhotos.findMany({
    where: {
      userId: userId,
    },
    include: {
      photo: {
        include: {
          user: true,
          location: true,
        },
      },
    },
  });
  const data = items.map((it) => it.photo);
  const photos = data.map((photo) => {
    const fileName = photo.fileName.split('.')[0];

    return {
      ...photo,
      url: thumbnail(fileName),
    };
  });

  return NextResponse.json({ photos });
}
