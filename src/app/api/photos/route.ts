import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

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
