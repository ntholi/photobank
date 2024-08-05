import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { thumbnail } from '@/lib/config/urls';
import { z } from 'zod';

const QuerySchema = z.object({
  searchKey: z.string().optional(),
});

const BodySchema = z.object({
  tagId: z.number().optional(),
  locationId: z.string().optional(),
});

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url || '');
  const queryResult = QuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!queryResult.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 },
    );
  }
  const { searchKey } = queryResult.data;

  let bodyResult;
  try {
    const body = await req.json();
    bodyResult = BodySchema.safeParse(body);

    if (!bodyResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error('Error parsing request body', err);
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 },
    );
  }

  const { tagId, locationId } = bodyResult.data;

  const tag = tagId
    ? await prisma.tag.findFirst({
        where: { id: tagId },
      })
    : null;

  const labels: string[] = tag ? tag.labels : [];

  const data = await prisma.photo.findMany({
    where: {
      status: 'published',
      caption: searchKey
        ? {
            contains: searchKey,
            mode: 'insensitive',
          }
        : undefined,
      labels: tagId
        ? {
            some: {
              label: {
                in: labels,
              },
            },
          }
        : undefined,
      locationId: locationId ? locationId : undefined,
    },
    include: {
      user: true,
    },
  });

  const photos = data.map((it) => {
    const fileName = it.fileName.split('.')[0];
    return {
      ...it,
      url: thumbnail(fileName),
    };
  });

  return NextResponse.json(photos);
}
