import { auth } from '@/lib/config/firebase';
import { prisma } from '@/lib/db';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, names } = body;

    if (!email || !password) {
        throw new Error('Missing Fields');
    }

    const userId = await createFirebaseUser(names, email, password);
    await saveUserToDatabase(userId, names, email);
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
    const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );
    await updateProfile(user, {
        displayName: names,
    });
    return user?.uid;
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
