import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { thumbnail } from '@/lib/config/urls';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url || '');
  const searchKey = searchParams.get('searchKey');

  let tagId = undefined;
  try {
    tagId = (await req.json()).id;
  } catch (err) {
    console.error('Error parsing request body');
  }

  const labels = await prisma.label.findMany({
    where: {
      tags: {
        some: {
          id: tagId,
        },
      },
    },
  });

  const data = await prisma.photo.findMany({
    where: {
      status: 'published',
      caption: {
        contains: searchKey ? searchKey : '',
        mode: 'insensitive',
      },
      labels: tagId && {
        some: {
          labelId: {
            in: labels.map((it) => it.id),
          },
        },
      },
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

  return NextResponse.json({ photos });
}
