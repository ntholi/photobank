import ProfileBody from './ProfileBody';
import UserBio from './UserBio';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { User } from '@prisma/client';

type Props = { params: { username: string } };

const getUser = async (username: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return notFound();
  }
  return user;
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.username);

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
