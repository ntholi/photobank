import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/auth';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  const session = await auth();
  if (session?.user?.id !== params.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });
  return NextResponse.json({ user });
}

export async function PUT(request: Request, { params }: Props) {
  const session = await auth();
  const { name, bio, website, username } = await request.json();

  if (session?.user?.id !== params.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      // username,
      name,
      bio,
      website,
    },
  });

  return NextResponse.json({ user });
}
