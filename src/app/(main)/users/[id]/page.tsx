import ProfileBody from './ProfileBody';
import UserBio from './UserBio';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const user = await getUser(params.id);
  return {
    title: `${user.name} ${APP_NAME}`,
    description: user.bio,
    image: user.image,
  } as Metadata;
}

const getUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return notFound();
  }
  return user;
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.id);

  if (!user) {
    return notFound();
  }

  return (
    <>
      <UserBio user={user} />
      <ProfileBody userId={user.id} />
    </>
  );
}
