import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { PhotoData, savePhoto } from './photoService';

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'You must be logged in to save a photo' },
            { status: 401 },
        );
    }

    const photo = (await request.json()) as PhotoData;

    console.log({ photo });

    if (!photo.photoUrl || !photo.name) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 },
        );
    }
    try {
        await savePhoto(photo, session?.user?.id);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: 'Failed to save photo' },
            { status: 500 },
        );
    }

    return NextResponse.json({ success: true });
}
