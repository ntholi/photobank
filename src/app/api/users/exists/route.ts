import { adminAuth } from '@/lib/config/firebase-admin';
import { prisma } from '@/lib/db';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url || '');
    const email = searchParams.get('email') || '';
    const username = searchParams.get('username') || '';

    let user: User | null = null;

    if (username) {
        user = await prisma.user.findFirst({
            where: {
                username,
            },
        });
    } else if (email) {
        if (await adminAuth.getUserByEmail(email)) {
            user = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
        }
    }

    return NextResponse.json({
        exists: !!user,
    });
}
