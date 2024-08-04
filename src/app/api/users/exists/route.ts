import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url || '');
  const email = searchParams.get('email') || '';

  let user: User | null = null;

  if (email) {
    user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  return NextResponse.json({
    exists: !!user,
  });
}
