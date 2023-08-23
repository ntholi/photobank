import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

type Props = {
    params: {
        id: string;
    };
};

export async function POST(request: Request, { params }: Props) {
    const session = await getServerSession(authOptions);
    const photoId = Number(params.id || -1);

    console.log('photoId', photoId);
    console.log('session', session?.user?.id);

    if (photoId < 0) {
        throw new Error(`Invalid id ${photoId}`);
    }
    const res = await prisma.savedPhotos.create({
        data: {
            photo: {
                connect: {
                    id: photoId,
                },
            },
            user: {
                connect: {
                    id: Number(session?.user?.id),
                },
            },
        },
    });
    console.log('res', res);

    return NextResponse.json({ success: true });
}
