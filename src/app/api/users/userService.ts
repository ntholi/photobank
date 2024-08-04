import prisma from '@/lib/prisma';
import commonUrlPatterns from './commonUrlPatterns';
import { User } from 'next-auth';

export const saveUserToDB = async (user: User) => {
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
      email: user.email,
      name: user.name,
      image: user.image,
    },
  });
};
