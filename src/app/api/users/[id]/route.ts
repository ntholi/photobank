import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/config/firebase-admin';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  const session = await getServerSession(authOptions);
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
  const session = await getServerSession(authOptions);
  const { firstName, lastName, bio, website, username } = await request.json();

  if (session?.user?.id !== params.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await adminAuth.updateUser(params.id, {
    displayName: `${firstName} ${lastName}`,
  });

  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      // username,
      firstName,
      lastName,
      bio,
      website,
    },
  });

  return NextResponse.json({ user });
}
