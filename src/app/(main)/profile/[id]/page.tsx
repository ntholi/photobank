import ProfileBody from './ProfileBody';
import UserBio from './UserBio';
import { notFound } from 'next/navigation';
import admin from '@/lib/config/firebase-admin';
import { User } from 'next-auth';

type Props = { params: { id: string } };

const getUser = async (id: string): Promise<User> => {
  const user = await admin.app().auth().getUser(id);
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
