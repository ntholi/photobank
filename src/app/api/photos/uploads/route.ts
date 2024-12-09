import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { thumbnail } from '@/lib/config/urls';
import { auth } from '@/auth';
import { z } from 'zod';
import { processImage } from '@/server/photos/imageService';

const PhotoData = z.object({
  fileName: z.string(),
  description: z.string().optional(),
  location: z
    .object({
      id: z.string(),
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url || '');
  const userId = searchParams.get('userId') || '';
  const data = await prisma.photo.findMany({
    where: {
      userId: userId,
      status: userId !== session?.user?.id ? 'published' : undefined,
    },
    include: {
      user: true,
      location: true,
    },
  });
  const photos = data.map((photo) => {
    const fileName = photo.fileName.split('.')[0];

    return {
      ...photo,
      url: thumbnail(fileName),
    };
  });

  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const session = await auth();
  const { location, description, fileName } = PhotoData.parse(
    await request.json(),
  );
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'You must be logged in to upload a photo' },
      { status: 401 },
    );
  }

  const { labels } = await processImage(fileName);
  const photo = await prisma.photo.create({
    data: {
      user: {
        connect: {
          id: session.user.id,
        },
      },
      fileName: fileName,
      labels: {
        create: labels.map((it) => ({
          confidence: it.confidence,
          label: it.name,
        })),
      },
      description: description,
      status: 'published',
      location: location
        ? {
            connectOrCreate: {
              where: {
                id: location.id,
              },
              create: {
                id: location.id,
                name: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
          }
        : undefined,
    },
  });

  return NextResponse.json({ photo });
}
