import ProfileNav from '../components/Nav';
import ProfileBody from '../components/ProfileBody';
import UserBio from '../components/UserBio';

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  const username = params.slug;
  return (
    <main>
      <div className="flex">
        <ProfileNav username={username} />
        <section className="w-screen px-16">
          <UserBio />
          <ProfileBody />
        </section>
      </div>
    </main>
  );
}
