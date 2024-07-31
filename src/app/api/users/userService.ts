import prisma from '@/lib/prisma';
import commonUrlPatterns from './commonUrlPatterns';
import { User } from 'next-auth';

export const saveUserToDB = async (user: User) => {
  const { firstName, lastName } = destructureNames(user.name);
  if (!user.email) {
    //TODO: Is this necessary?
    throw new Error('User email is required');
  }
  return await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {},
    create: {
      id: user.id,
      username: await generateUsername(firstName, lastName),
      email: user.email,
      name: user.name,
      image: user.image,
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

  if (commonUrlPatterns.includes(username) || username.length < 3) {
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
