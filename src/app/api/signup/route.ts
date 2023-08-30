import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/config/firebase-admin';

export async function POST(request: Request) {
    const { email, password, names } = await request.json();

    if (!email || !password) {
        throw new Error('Missing Fields');
    }

    try {
        const user = await adminAuth.createUser({
            email,
            password,
            displayName: names,
        });
        await prisma.user.create({
            data: {
                id: user.uid,
            },
        });
        await adminAuth.setCustomUserClaims(user.uid, {
            role: 'user',
        });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error });
    }
}
