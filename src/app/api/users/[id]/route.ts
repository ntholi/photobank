import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, props: Props) {
  const params = await props.params;
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

export async function PUT(request: Request, props: Props) {
  const params = await props.params;
  const session = await auth();
  const { name, bio, website } = await request.json();

  if (session?.user?.id !== params.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      name,
      bio,
      website,
    },
  });

  return NextResponse.json({ user });
}
