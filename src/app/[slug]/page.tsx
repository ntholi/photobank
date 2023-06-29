import UserBio from './components/UserBio';
import ProfileNav from './components/Nav';
import ProfileBody from './components/ProfileBody';

type Params = { params: { slug: string } };

export default function Page({ params }: Params) {
  const username = params.slug;
  return (
    <main>
      <div className='flex'>
        <ProfileNav username={username} />
        <section className='w-screen px-16'>
          <UserBio />
          <ProfileBody />
        </section>
      </div>
    </main>
  );
}
