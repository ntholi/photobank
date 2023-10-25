import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || '';

  const items = await prisma.purchasedPhotos.findMany({
    where: {
      userId: userId,
    },
    include: {
      photo: true,
    },
  });
  const photos = items.map((it) => it.photo);
  return NextResponse.json({ photos });
}
