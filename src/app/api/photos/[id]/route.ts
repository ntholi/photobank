import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { thumbnail } from '@/lib/config/urls';
import { z } from 'zod';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  const photo = await prisma.photo.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!photo) {
    throw new Error(`Photo with id ${params.id} not found`);
  }

  const fileName = photo.fileName.split('.')[0];

  return NextResponse.json({
    photo: {
      ...photo,
      url: thumbnail(fileName),
    },
  });
}

const PhotoData = z.object({
  caption: z.string(),
  useWithoutWatermark: z.boolean(),
  location: z.object({
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
});

export async function PUT(request: Request, { params }: Props) {
  const { location, caption, useWithoutWatermark } = PhotoData.parse(
    await request.json(),
  );

  console.log({ location, caption, useWithoutWatermark });

  const photo = await prisma.photo.update({
    where: {
      id: params.id,
    },
    data: {
      caption: caption,
      status: 'published',
      useWithoutWatermark: Boolean(useWithoutWatermark),
      location: location && {
        connectOrCreate: {
          where: {
            name: location.name,
          },
          create: {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
          },
        },
      },
    },
  });
  return NextResponse.json(photo);
}
