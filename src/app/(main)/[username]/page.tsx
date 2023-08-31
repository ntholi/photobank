import ProfileBody from './ProfileBody';
import UserBio from './UserBio';
import { notFound } from 'next/navigation';
import { User } from 'next-auth';
import { adminAuth } from '@/lib/config/firebase-admin';
import { prisma } from '@/lib/db';

type Props = { params: { username: string } };

const getUser = async (username: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return notFound();
  }
  return {
    id: user.id,
    username: user.username,
    name: `${user.firstName} ${user.lastName}`,
    image: user.image,
  };
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.username);

  if (!user) {
    return notFound();
  }

  return (
    <>
      <UserBio {...user} />
      <ProfileBody userId={user.id} />
    </>
  );
}
