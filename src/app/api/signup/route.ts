import { NextResponse } from 'next/server';
import admin from '@/lib/config/firebase-admin';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    const { email, password, names } = await request.json();

    if (!email || !password) {
        throw new Error('Missing Fields');
    }

    try {
        const user = await admin.app().auth().createUser({
            email,
            password,
            displayName: names,
        });
        await prisma.user.create({
            data: {
                id: user.uid,
            },
        });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error });
    }
}
