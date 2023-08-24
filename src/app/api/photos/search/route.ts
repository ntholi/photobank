import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { GalleryType } from '@/lib/constants';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL(req.url || '');

    console.log('searchParams', searchParams);

    const searchKey = searchParams.get('searchKey') as GalleryType;
    console.log('searchKey', searchKey);

    return await publicPhotos(searchKey);
}

async function publicPhotos(searchKey: string) {
    if (!searchKey) {
        const photos = await prisma.photo.findMany({
            where: {
                status: 'approved',
            },
            include: {
                user: true,
            },
        });
        return NextResponse.json({ photos });
    }

    const photos = await prisma.photo.findMany({
        where: {
            status: 'approved',
            name: {
                contains: searchKey,
                mode: 'insensitive',
            },
        },
        include: {
            user: true,
        },
    });
    return NextResponse.json({ photos });
}
