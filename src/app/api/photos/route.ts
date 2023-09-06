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
