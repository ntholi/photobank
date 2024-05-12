import { auth } from '@/auth';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || '';

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  let application = await prisma.contributorApplication.upsert({
    create: {
      userId: session.user.id,
    },
    update: {},
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
