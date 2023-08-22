import { prisma } from '@/lib/db';
import ProfileBody from '../components/ProfileBody';
import UserBio from '../components/UserBio';
import { notFound } from 'next/navigation';

type Props = { params: { slug: string } };

const getUser = async (username: string) => {
  if (!username) return null;
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.slug);

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
