import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const data = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      _count: {
        select: {
          photos: true,
        },
      },
    },
  });

  const locations = data.map((it) => {
    return {
      id: it.id,
      name: it.name,
      lat: it.latitude,
      lng: it.longitude,
      photoCount: it._count.photos,
    };
  });

  return NextResponse.json({ locations });
}
