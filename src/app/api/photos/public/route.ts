import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const photos = await prisma.photo.findMany({
        where: {
            status: 'approved',
        },
        include: {
            user: true,
            location: true,
        },
    });
    return NextResponse.json({ photos });
}
