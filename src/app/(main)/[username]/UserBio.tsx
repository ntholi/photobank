'use client';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { useSession } from 'next-auth/react';

type Props = {
  photoURL?: string;
  displayName?: string;
  username: string;
};

export default function UserBio({ photoURL, displayName, username }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex mt-8">
      <Image
        width={250}
        height={250}
        referrerPolicy="no-referrer"
        src={largeSize(photoURL) || '/images/profile.png'}
        className="rounded-full border border-zinc-400 w-32 h-32 sm:w-40 sm:h-40"
        alt="Profile Picture"
      />
      <div className="ml-5 sm:ml-16 mt-2 sm:mt-3">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-600">
          {displayName}
        </h1>
        {user?.username === username && (
          <Button size="sm" className="mt-3" radius="sm">
            Edit Profile
          </Button>
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