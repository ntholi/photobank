import { getUser } from '@/server/users/actions';
import { notFound } from 'next/navigation';
import ProfileTabs from './ProfileTabs';
import { Avatar } from '@heroui/avatar';
import { Chip } from '@heroui/chip';
import { largeProfilePic } from '@/lib/utils';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  const image = largeProfilePic(user.image || '');

  return (
    <div className='min-h-screen max-w-5xl mx-auto px-4 py-8'>
      <div className='flex items-center gap-8'>
        <Avatar
          src={image || '/profile.png'}
          name={user.name || ''}
          className='w-28 h-28 text-large'
          radius='full'
        />
        <div className='flex-1'>
          <div className='flex items-center gap-4 mb-2'>
            <h1 className='text-2xl font-semibold'>{user.name}</h1>
            <Chip variant='flat' color='primary' size='sm'>
              {user.role}
            </Chip>
          </div>
          <p className='text-default-500 max-w-2xl'>{user.bio}</p>
        </div>
      </div>

      <div className='mt-8 border-t border-white/10' />

      <div className='mt-6'>
        <ProfileTabs userId={id} />
      </div>
    </div>
  );
}
