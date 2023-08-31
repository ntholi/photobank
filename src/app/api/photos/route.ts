import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'You must be an admin to get all photos' },
            { status: 401 },
        );
    }

    const photos = await prisma.photo.findMany();
    return NextResponse.json({ photos });
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

    const dbLocation = await prisma.location.upsert({
        where: {
            name: location.name,
        },
        update: {},
        create: {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
        },
    });

    await prisma.photo.create({
        data: {
            name: name,
            location: {
                connect: dbLocation,
            },
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
