import { thumbnail } from '@/lib/config/urls';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const data = await prisma.photo.findMany({
        where: {
            status: 'published',
            useWithoutWatermark: true,
        },
        include: {
            user: true,
            location: true,
        },
    });

    const photos = data.map((photo) => {
        const fileName = photo.fileName.split('.')[0];
        return {
            ...photo,
            url: thumbnail(fileName),
        };
    });

    return NextResponse.json({ photos });
}
