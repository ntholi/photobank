import { prisma } from '@/lib/db';
import commonUrlPatterns from './commonUrlPatterns';
import { User as FirebaseUser } from 'firebase/auth';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

export const saveUserToDB = async (firebaseUser: FirebaseUser | UserRecord) => {
    const { firstName, lastName } = destructureNames(firebaseUser.displayName);
    return await prisma.user.upsert({
        where: {
            id: firebaseUser.uid,
        },
        update: {},
        create: {
            id: firebaseUser.uid,
            username: await generateUsername(firstName, lastName),
            email: firebaseUser.email,
            firstName: firstName,
            lastName: lastName,
        },
    });
};

export async function generateUsername(firstName: string, lastName: string) {
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
