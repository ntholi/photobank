import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

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
                username: toUsername(names),
                email: email,
                firstName: firstName,
                lastName: lastName,
                hashedPassword: hashedPassword,
            },
        });
    }

    return NextResponse.json({
        ...user,
        hashedPassword: undefined,
    });
}

function toUsername(str: string) {
    return str.replace(' ', '').toLowerCase();
}
