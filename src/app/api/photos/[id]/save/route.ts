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

    const res = await prisma.savedPhotos.create({
        data: {
            photo: {
                connect: {
                    id: params.id,
                },
            },
            user: {
                connect: {
                    id: session?.user?.id,
                },
            },
        },
    });

    return NextResponse.json({ success: true });
}
