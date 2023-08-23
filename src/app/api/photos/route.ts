import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { GalleryType } from '@/lib/constants';
import { User } from '@prisma/client';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url || '');
    const photoType = searchParams.get('type') as GalleryType;

    const owner = await prisma.user.findUnique({
        where: {
            id: Number(searchParams.get('userId')),
        },
    });

    if (!photoType && !owner) {
        return await publicPhotos();
    } else if (photoType === GalleryType.PURCHASED) {
        return await getPurchased(owner, session?.user);
    } else if (photoType === GalleryType.SAVED) {
        return await getSaved(owner, session?.user);
    } else {
        return await getUploads(owner, session?.user);
    }
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId),
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

async function publicPhotos() {
    const photos = await prisma.photo.findMany({
        where: {
            status: 'approved',
        },
    });
    return NextResponse.json({ photos });
}

async function getUploads(owner: User | null, sessionUser: SessionUser) {
    const photos = await prisma.photo.findMany({
        where: {
            userId: Number(sessionUser?.id),
            status: !isOwner(owner, sessionUser) ? 'approved' : undefined,
        },
    });
    return NextResponse.json({ photos });
}

async function getPurchased(owner: User | null, sessionUser: SessionUser) {
    if (!isOwner(owner, sessionUser)) {
        return [];
    }
    const items = await prisma.purchasedPhotos.findMany({
        where: {
            id: Number(sessionUser?.id),
        },
        include: {
            photo: true,
        },
    });
    const photos = items.map((it) => it.photo);
    return NextResponse.json({ photos });
}

async function getSaved(owner: User | null, sessionUser: SessionUser) {
    if (!(owner?.id === Number(sessionUser?.id))) {
        return [];
    }
    const items = await prisma.savedPhotos.findMany({
        where: {
            id: Number(sessionUser?.id),
        },
        include: {
            photo: true,
        },
    });
    const photos = items.map((it) => it.photo);
    return NextResponse.json({ photos });
}

const isOwner = (user: User | null, sessionUser: SessionUser) => {
    const requestedBy = Number(sessionUser?.id);
    console.log('sessionUser?.role', sessionUser?.role);
    if (sessionUser?.role === 'admin' || sessionUser?.role === 'moderator') {
        return true;
    }
    return user?.id === requestedBy;
};
