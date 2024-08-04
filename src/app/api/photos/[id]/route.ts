import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { imageProcessor, thumbnail } from '@/lib/config/urls';
import { z } from 'zod';
import axios from 'axios';

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
  caption: z.string().optional(),
  useWithoutWatermark: z.boolean().default(false),
  location: z
    .object({
      id: z.string(),
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export async function PUT(request: Request, { params }: Props) {
  try {
    const { location, caption, useWithoutWatermark } = PhotoData.parse(
      await request.json(),
    );

    const { fileName } = (await prisma.photo.findUnique({
      where: {
        id: params.id,
      },
    })) as { fileName: string };

    const photo = await prisma.photo.update({
      where: {
        id: params.id,
      },
      data: {
        caption: caption,
        status: 'published',
        useWithoutWatermark: useWithoutWatermark,
        location: location && {
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
        },
      },
    });

    if (photo.useWithoutWatermark) {
      await axios.get(imageProcessor(fileName, false));
    }

    return NextResponse.json(photo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Handle other types of errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
