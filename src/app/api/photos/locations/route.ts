import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const data = await prisma.location.findMany({
        select: {
            id: true,
            name: true,
            lat: true,
            lng: true,
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
            lat: it.lat,
            lng: it.lng,
            photoCount: it._count.photos,
        };
    });

    return NextResponse.json({ locations });
}
