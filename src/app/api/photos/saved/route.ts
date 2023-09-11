import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const items = await prisma.savedPhotos.findMany({
        where: {
            userId: userId,
        },
        include: {
            photo: {
                include: {
                    user: true,
                    location: true,
                },
            },
        },
    });
    const data = items.map((it) => it.photo);
    const photos = data.map((photo) => {
        const fileName = photo.fileName.split('.')[0];

        return {
            ...photo,
            url: `https://djvt9h5y4w4rn.cloudfront.net/${fileName}-thumb.jpg`,
        };
    });

    return NextResponse.json({ photos });
}
