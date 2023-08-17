import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const photoType = searchParams.get('type');

    // const photos = await prisma.photo.findMany();
    return NextResponse.json([]);
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const user = await prisma.user.findUnique({
        where: {
            id: userId || '',
        },
    });
    if (!user) {
        throw new Error(`User with id ${userId} not found`);
    }

    const { name, description, location, photoUrl } = await request.json();
    if (!photoUrl || !name) {
        throw new Error('Missing Fields');
    }

    await prisma.photo.create({
        data: {
            name: name,
            location: location,
            description: description,
            url: photoUrl,
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    return NextResponse.json({ success: true });
}
