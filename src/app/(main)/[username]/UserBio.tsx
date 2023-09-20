'use client';
import { profilePath } from '@/lib/constants';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Image } from '@nextui-org/image';
import { IconStar } from '@tabler/icons-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BiSolidBadgeCheck } from 'react-icons/bi';

type Props = {
  image?: string | null;
  name?: string | null;
  id: string;
};

export default function UserBio({ image, name, id }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex mt-8">
      <Image
        width={250}
        height={250}
        referrerPolicy="no-referrer"
        src={largeSize(image) || '/images/profile.png'}
        className="rounded-full border border-zinc-400 w-32 h-32 sm:w-40 sm:h-40"
        alt="Profile Picture"
      />
      <div className="ml-5 sm:ml-16 mt-2 sm:mt-3">
        <div className="flex gap-4 items-baseline">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-600">
            {name}
          </h1>
          {user?.id === id && (
            <Button
              size="sm"
              radius="sm"
              variant="bordered"
              as={Link}
              href={`${profilePath(user)}/edit`}
            >
              Edit Profile
            </Button>
          )}
        </div>
        {user?.role !== 'user' && (
          <Chip
            color="primary"
            variant="bordered"
            size="sm"
            avatar={<BiSolidBadgeCheck size={8} />}
            className="capitalize text-xs border-1"
          >
            {user?.role}
          </Chip>
        )}
      </div>
    </div>
  );
}

const largeSize = (photoURL?: string | null) => {
  if (!photoURL) return null;
  if (photoURL.includes('googleusercontent')) {
    return photoURL.replace('s96-c', 's400-c');
  }
  return photoURL;
};

export const nameToInitials = (name?: string | null) => {
  if (!name) return '?';
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};
