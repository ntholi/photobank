import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const data = await prisma.photo.findMany({
        where: {
            status: 'published',
        },
        include: {
            user: true,
            location: true,
        },
    });

    const photos = data.map((it) => {
        const fileName = it.fileName.split('.')[0];
        return {
            ...it,
            id: 'hello Word',
            url: `https://djvt9h5y4w4rn.cloudfront.net/${fileName}-thumb.jpg`,
        };
    });

    console.log({ photos });

    return NextResponse.json({ photos });
}
