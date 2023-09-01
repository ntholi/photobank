import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url || '');
    const searchKey = searchParams.get('searchKey');

    const tag = (await req.json()) as { id: number };

    const photos = await prisma.photo.findMany({
        where: {
            status: 'approved',
            name: {
                contains: searchKey ? searchKey : '',
                mode: 'insensitive',
            },
            tags: {
                some: {
                    tagId: tag.id,
                },
            },
        },
        include: {
            user: true,
        },
    });
    return NextResponse.json({ photos });
}
