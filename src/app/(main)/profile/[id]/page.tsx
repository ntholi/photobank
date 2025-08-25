import { getUser, getUserStats } from '@/server/users/actions';
import { notFound } from 'next/navigation';
import ProfileTabs from './ProfileTabs';
import { Avatar } from '@heroui/avatar';
import { largeProfilePic } from '@/lib/utils';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import RoleBadge from '@/app/components/RoleBadge';
import { IoLink } from 'react-icons/io5';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const [user, stats] = await Promise.all([getUser(id), getUserStats(id)]);

  if (!user) notFound();

  const image = largeProfilePic(user.image || '');

  return (
    <div className='mx-auto min-h-screen max-w-4xl px-4 py-8'>
      <div className='mb-10 flex items-start gap-10'>
        <Avatar
          src={image || '/profile.png'}
          name={user.name || ''}
          className='text-large h-28 w-28 sm:h-36 sm:w-36'
          radius='full'
        />

        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-2'>
            <h1 className='text-2xl font-medium'>{user.name}</h1>
            <RoleBadge role={user.role} />
            <Button
              as='a'
              href={`/profile/${id}/edit`}
              variant='flat'
              size='sm'
              className='ml-auto'
            >
              Edit Profile
            </Button>
            <Button
              as='a'
              href={`/profile/${id}/uploads`}
              color='primary'
              size='sm'
            >
              Upload Photo
            </Button>
          </div>

          <div className='mb-2 flex items-center gap-8 text-sm'>
            <div>
              <span className='font-semibold'>{stats.uploads}</span> uploads
            </div>
            <div>
              <span className='font-semibold'>{stats.saved}</span> saved
            </div>
          </div>

          <div className='space-y-2'>
            {user.bio ? (
              <p className='text-default-600 whitespace-pre-wrap'>{user.bio}</p>
            ) : (
              <p className='text-default-500 text-sm italic'>
                This user has no bio
              </p>
            )}

            {user.website && (
              <div className='flex items-center gap-1'>
                <IoLink size={16} className='text-default-500' />
                <Link
                  href={user.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary text-sm hover:underline'
                >
                  {user.website}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='border-t border-white/10'>
        <ProfileTabs userId={id} />
      </div>
    </div>
  );
}
