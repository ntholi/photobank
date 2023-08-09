import admin from '@/lib/config/firebase-admin';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log(admin.auth);
    const body = await request.json();
    const { email, password, names } = body;
    if (!email || !password) {
        throw new Error('Missing Fields');
    }
    try {
        const userId = await createFirebaseUser(names, email, password);
        await saveUserToDatabase(userId, names, email);
    } catch (error: any) {
        console.error(error);
        if (error.errorInfo) {
            throw new Error(error.errorInfo.message);
        }
    }

    return NextResponse.json({ success: true });
}

function saveUserToDatabase(uid: string, names: string, email: string) {
    const { firstName, lastName } = extractNames(names);
    return prisma.user.create({
        data: {
            id: uid,
            email: email,
            firstName: firstName,
            lastName: lastName,
        },
    });
}

async function createFirebaseUser(
    names: string,
    email: string,
    password: string,
) {
    const user = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: names,
    });
    return user.uid;
}

function extractNames(names: string) {
    let firstName = names;
    let lastName = '';
    if (names && names.split(' ').length >= 2) {
        const namesArray = names.split(' ');
        firstName = namesArray.slice(0, namesArray.length - 1).join(' ');
        lastName = namesArray[namesArray.length - 1];
    }
    return { firstName, lastName };
}
