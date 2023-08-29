import ProfileBody from './ProfileBody';
import UserBio from './UserBio';
import { notFound } from 'next/navigation';
import { User } from 'next-auth';
import { adminAuth } from '@/lib/config/firebase-admin';

type Props = { params: { id: string } };

const getUser = async (id: string): Promise<User> => {
  const user = await adminAuth.getUser(id);
  return {
    id: user.uid,
    name: user.displayName,
    image: user.photoURL,
  };
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.id);

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
