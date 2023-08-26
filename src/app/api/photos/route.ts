import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { GalleryType } from '@/lib/constants';
import { Role, User } from '@prisma/client';
import { SessionUser } from '@/lib/types';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url || '');
    const photoType = searchParams.get('type') as GalleryType;
    const fromAdmin = searchParams.get('fromAdmin') === 'true'; //TODO: THIS IS A TERRIBLE WAY TO DO THIS
    if (fromAdmin) {
        const photos = await prisma.photo.findMany({});
        return NextResponse.json({ photos });
    }

    const owner = await prisma.user.findUnique({
        where: {
            id: searchParams.get('userId') || '',
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

async function publicPhotos() {
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

async function getUploads(owner: User | null, sessionUser: SessionUser) {
    const photos = await prisma.photo.findMany({
        where: {
            userId: owner?.id,
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
            id: Number(owner?.id),
        },
        include: {
            photo: true,
        },
    });
    const photos = items.map((it) => it.photo);
    return NextResponse.json({ photos });
}

async function getSaved(owner: User | null, sessionUser: SessionUser) {
    if (!(owner?.id === sessionUser?.id)) {
        return [];
    }
    const items = await prisma.savedPhotos.findMany({
        where: {
            id: Number(owner?.id),
        },
        include: {
            photo: true,
        },
    });
    const photos = items.map((it) => it.photo);
    return NextResponse.json({ photos });
}

const isOwner = (user: User | null, sessionUser: SessionUser) => {
    const requestedBy = sessionUser?.id;
    if (
        sessionUser?.role === Role.admin ||
        sessionUser?.role === Role.moderator
    ) {
        return true;
    }
    return user?.id === requestedBy;
};
