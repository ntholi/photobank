import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url || '');

    const userId = searchParams.get('userId') || '';

    const photos = await prisma.photo.findMany({
        where: {
            userId: userId,
            status: userId !== session?.user?.id ? 'approved' : undefined,
        },
    });
    return NextResponse.json({ photos });
}
