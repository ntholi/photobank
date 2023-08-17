import ProfileBody from '../components/ProfileBody';
import UserBio from '../components/UserBio';
import admin from '@/lib/config/firebase-admin';

type Props = { params: { id: string } };

const getUser = async (id: string) => {
  return await admin.auth().getUser(id);
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.id);
  return (
    <section className="w-screen px-16">
      <UserBio displayName={user.displayName} photoURL={user.photoURL} />
      <ProfileBody />
    </section>
  );
}
