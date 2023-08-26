import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import admin from '@/lib/config/firebase-admin';
import { saveUserToDB } from '../users/userService';

export async function POST(request: Request) {
    const { email, password, names } = await request.json();

    if (!email || !password) {
        throw new Error('Missing Fields');
    }

    let user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        const firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: names,
        });
        user = await saveUserToDB(firebaseUser);
    }

    return NextResponse.json({ user: { ...user, hashedPassword: undefined } });
}
