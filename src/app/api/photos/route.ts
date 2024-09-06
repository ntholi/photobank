import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { imageProcessorUrl } from '@/lib/config/urls';
import { auth } from '@/auth';
import { z } from 'zod';

type Label = {
  Name: string;
  Confidence: number;
  Categories: string[];
};

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

  if (session?.user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'You must be an admin to get all photos' },
      { status: 401 },
    );
  }

  const photos = await prisma.photo.findMany();
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  await new Promise((r) => setTimeout(r, 3000)); //TODO: Remove this line

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

  const res = await axios.get(imageProcessorUrl(fileName));
  const { labels: awsLabels } = res.data as { labels: Label[] };
  const labels: { name: string; confidence: number }[] = [];
  awsLabels.forEach((label) => {
    label.Categories.forEach((category) => {
      if (!labels.find((it) => it.name === category)) {
        labels.push({ name: category, confidence: label.Confidence });
      }
    });
  });

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
