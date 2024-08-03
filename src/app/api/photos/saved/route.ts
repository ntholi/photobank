import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { thumbnail } from '@/lib/config/urls';
import { auth } from '@/auth';
import { z } from 'zod';

// action is 'save' or 'remove'
const schema = z.object({
  photoId: z.string(),
  action: z.enum(['save', 'remove']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { photoId, action } = schema.parse(body);
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'save') {
      const savedPhoto = await prisma.savedPhotos.create({
        data: {
          userId: session.user.id,
          photoId,
        },
      });
      return NextResponse.json(savedPhoto);
    } else if (action === 'remove') {
      const removedPhoto = await prisma.savedPhotos.delete({
        where: {
          userId: session.user.id,
          photoId,
        },
      });
      return NextResponse.json(removedPhoto);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
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
