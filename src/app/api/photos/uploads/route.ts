import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { thumbnail } from '@/lib/config/urls';
import { auth } from '@/auth';

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
