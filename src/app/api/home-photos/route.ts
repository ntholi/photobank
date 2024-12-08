import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const photos = await prisma.homePhoto.findMany({
    select: { id: true, photo: true, order: true },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(photos);
}
