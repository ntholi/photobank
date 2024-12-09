import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const filters = await prisma.tag.findMany({
    take: 10,
    //TODO: TAKE MOST USED TAGS
  });

  return NextResponse.json({
    filters: [
      {
        name: 'All',
        type: 'all',
        id: 0,
      },
      ...filters,
    ],
  });
}
