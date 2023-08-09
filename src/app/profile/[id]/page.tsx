import ProfileNav from '../components/Nav';
import ProfileBody from '../components/ProfileBody';
import UserBio from '../components/UserBio';
import admin from '@/lib/config/firebase-admin';

type Props = { params: { id: string } };

const getUser = async (id: string) => {
  const user = await admin.auth().getUser(id);
  return user;
};

export default async function Page({ params }: Props) {
  const user = await getUser(params.id);
  return (
    <main>
      <div className="flex">
        <ProfileNav />
        <section className="w-screen px-16">
          <UserBio {...user} />
          <ProfileBody />
        </section>
      </div>
    </main>
  );
}
