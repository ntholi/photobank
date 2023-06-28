import ProfileNav from './components/Nav';

type Params = { params: { slug: string } };

export default function Page({ params }: Params) {
  const username = params.slug;
  return (
    <div className='flex'>
      <ProfileNav />
      <div>My Post: {params.slug}</div>
    </div>
  );
}
