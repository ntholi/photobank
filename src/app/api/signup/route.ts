import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import commonUrlPatterns from './commonUrlPatterns';
import admin from '@/lib/config/firebase-admin';

export async function POST(request: Request) {
    const { email, password, names } = await request.json();

    if (!email || !password) {
        throw new Error('Missing Fields');
    }

    const { firstName, lastName } = destructureNames(names);

    const exists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    let user = exists;
    if (!exists) {
        const { uid } = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: `names`,
        });

        user = await prisma.user.create({
            data: {
                id: uid,
                username: await generateUsername(firstName, lastName),
                email: email,
                firstName: firstName,
                lastName: lastName,
            },
        });
    }

    return NextResponse.json({ user: { ...user, hashedPassword: undefined } });
}

async function generateUsername(firstName: string, lastName: string) {
    let username = firstName.toLowerCase();
    let userWithSameUsername = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    let counter = 2;
    while (userWithSameUsername) {
        username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

        if (counter > 2) {
            username += counter;
        }
        userWithSameUsername = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        counter++;
    }

    if (commonUrlPatterns.includes(username)) {
        username += 'user'; // Append 'user' to the end
    }

    return username;
}

export function destructureNames(names?: string | null) {
    if (!names) return { firstName: '', lastName: '' };

    let firstName = names;
    let lastName = '';
    if (names && names.split(' ').length >= 2) {
        const namesArray = names.split(' ');
        firstName = namesArray.slice(0, namesArray.length - 1).join(' ');
        lastName = namesArray[namesArray.length - 1];
    }
    return { firstName, lastName };
}
