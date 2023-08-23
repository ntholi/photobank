import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { GalleryType } from '@/lib/constants';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url || '');
    const photoType = searchParams.get('type') as GalleryType;
    const requestedBy = Number(session?.user?.id);

    const user = await prisma.user.findUnique({
        where: {
            id: Number(searchParams.get('userId')),
        },
    });

    if (photoType === GalleryType.PURCHASED) {
        return NextResponse.json({
            photos: await getPurchased(user?.id, requestedBy),
        });
    } else if (photoType === GalleryType.SAVED) {
        return NextResponse.json({
            photos: await getSaved(user?.id, requestedBy),
        });
    } else {
        return NextResponse.json({
            photos: await getUploads(user?.id, requestedBy),
        });
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
async function getUploads(userId: number | undefined, requestedBy: number) {
    const isOwner = userId === requestedBy;

    return await prisma.photo.findMany({
        where: {
            userId: userId,
            status: !isOwner ? 'approved' : undefined,
        },
    });
}
async function getPurchased(userId: number | undefined, requestedBy: number) {
    const isOwner = userId === requestedBy;
    if (!isOwner) {
        return [];
    }
    const items = await prisma.purchasedPhotos.findMany({
        where: {
            id: requestedBy,
        },
        include: {
            photo: true,
        },
    });

    return items.map((it) => it.photo);
}

async function getSaved(userId: number | undefined, requestedBy: number) {
    const isOwner = userId === requestedBy;
    if (!isOwner) {
        return [];
    }
    const items = await prisma.savedPhotos.findMany({
        where: {
            id: requestedBy,
        },
        include: {
            photo: true,
        },
    });

    return items.map((it) => it.photo);
}
