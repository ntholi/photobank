import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url || '');
    const searchKey = searchParams.get('searchKey');

    let tagId = undefined;
    try {
        tagId = (await req.json()).id;
    } catch (err) {
        console.error('Error parsing request body');
    }

    const labels = await prisma.label.findMany({
        where: {
            tags: {
                some: {
                    id: tagId,
                },
            },
        },
    });

    const data = await prisma.photo.findMany({
        where: {
            status: 'published',
            caption: {
                contains: searchKey ? searchKey : '',
                mode: 'insensitive',
            },
            labels: {
                some: {
                    labelId: {
                        in: labels.map((it) => it.id),
                    },
                },
            },
        },
        include: {
            user: true,
        },
    });
    const photos = data.map((it) => {
        const fileName = it.fileName.split('.')[0];
        return {
            ...it,
            url: `https://djvt9h5y4w4rn.cloudfront.net/${fileName}-thumb.jpg`,
        };
    });

    return NextResponse.json({ photos });
}
