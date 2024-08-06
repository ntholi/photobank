import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '';

  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const application = await prisma.contributorApplication.findUnique({
    where: {
      userId: user.id,
    },
  });
  return NextResponse.json({ application }, { status: 201 });
}

const schema = z.object({
  motivation: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const { motivation } = schema.parse(await request.json());
  let application = await prisma.contributorApplication.upsert({
    create: {
      userId: session.user.id,
      message: motivation,
    },
    update: {},
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
