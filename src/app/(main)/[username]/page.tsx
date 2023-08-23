import { prisma } from '@/lib/db';
import ProfileBody from './ProfileBody';
import UserBio from './UserBio';
import { notFound } from 'next/navigation';

type Props = { params: { username: string } };

const getUser = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.username);

  if (!user) {
    return notFound();
  }

  return (
    <>
      <UserBio
        username={user?.username || ''}
        displayName={`${user?.firstName} ${user?.lastName}`}
        photoURL={user?.image || ''}
      />
      <ProfileBody userId={user.id} />
    </>
  );
}
