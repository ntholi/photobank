import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const photo = await prisma.savedPhotos.findFirst({
    where: {
      photoId: params.id,
      userId: session.user.id,
    },
  });

  const isSaved = photo?.id ? true : false;

  return NextResponse.json({
    isSaved,
  });
}
