import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { thumbnail } from '@/lib/config/urls';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const { photoId } = await req.json();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const savedPhoto = await prisma.savedPhotos.create({
    data: {
      userId: session.user?.id,
      photoId,
    },
  });

  return NextResponse.json(savedPhoto);
}

export async function GET(req: Request) {
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
