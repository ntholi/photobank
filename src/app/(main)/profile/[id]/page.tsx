import { prisma } from '@/lib/db';
import ProfileBody from '../components/ProfileBody';
import UserBio from '../components/UserBio';

type Props = { params: { slug: string } };

const getUser = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.slug);
  return (
    <>
      <UserBio
        username={user?.username || ''}
        displayName={`${user?.firstName} ${user?.lastName}`}
        photoURL={user?.image || ''}
      />
      <ProfileBody />
    </>
  );
}
