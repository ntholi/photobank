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

    const photos = await prisma.photo.findMany({
        where: {
            status: 'approved',
            name: {
                contains: searchKey ? searchKey : '',
                mode: 'insensitive',
            },
            tags: {
                some: {
                    tagId: tagId,
                },
            },
        },
        include: {
            user: true,
        },
    });
    return NextResponse.json({ photos });
}
