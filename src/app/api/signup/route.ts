import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import commonUrlPatterns from './commonUrlPatterns';

export async function POST(request: Request) {
    const { email, password, names } = await request.json();

    if (!email || !password) {
        throw new Error('Missing Fields');
    }

    let firstName = names;
    let lastName = '';
    if (names && names.split(' ').length >= 2) {
        const namesArray = names.split(' ');
        firstName = namesArray.slice(0, namesArray.length - 1).join(' ');
        lastName = namesArray[namesArray.length - 1];
    }

    const exists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    let user = exists;
    if (!exists) {
        const hashedPassword = await bcrypt.hash(password, 10);

        user = await prisma.user.create({
            data: {
                username: await generateUsername(firstName, lastName),
                email: email,
                firstName: firstName,
                lastName: lastName,
                hashedPassword: hashedPassword,
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
