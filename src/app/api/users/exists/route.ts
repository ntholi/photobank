import { prisma } from '@/lib/db';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
    const { searchParams } = new URL(req.url || '');
    const email = searchParams.get('email') || '';

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    return NextResponse.json({
        exists: !!user,
    });
}
