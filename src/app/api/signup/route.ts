import admin from '@/lib/config/firebase-admin';
import { prisma } from '@/lib/db';
import { User } from 'firebase/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, names } = body;
    if (!email || !password) {
        throw new Error('Missing Fields');
    }
    try {
        const user = await createFirebaseUser(names, email, password);
        await saveUserToDatabase(user);
    } catch (error: any) {
        console.error(error);
        if (error.errorInfo) {
            throw new Error(error.errorInfo.message);
        }
    }

    return NextResponse.json({ success: true });
}

export async function saveUserToDatabase(user: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
}) {
    const savedUser = await prisma.user.findUnique({
        where: {
            email: user.email || '',
        },
    });
    if (savedUser) {
        return savedUser;
    }
    const { firstName, lastName } = extractNames(user.displayName);
    return await prisma.user.create({
        data: {
            id: user.uid,
            email: user.email,
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
    return user;
}

function extractNames(names?: string | null) {
    if (!names) {
        return { firstName: '', lastName: '' };
    }
    let firstName = names;
    let lastName = '';
    if (names && names.split(' ').length >= 2) {
        const namesArray = names.split(' ');
        firstName = namesArray.slice(0, namesArray.length - 1).join(' ');
        lastName = namesArray[namesArray.length - 1];
    }
    return { firstName, lastName };
}
