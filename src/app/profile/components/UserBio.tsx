'use client';
import { Image } from '@nextui-org/image';

type Props = {
  photoURL?: string;
  displayName?: string;
};

export default function UserBio({ photoURL, displayName }: Props) {
  return (
    <div className="flex mt-14">
      <Image
        width={160}
        height={160}
        referrerPolicy="no-referrer"
        src={largeSize(photoURL) || '/images/profile.png'}
        className="rounded-full border border-zinc-400"
        alt="Profile Picture"
      />
      <div className="ml-20 mt-1">
        <h1 className="text-4xl font-bold">{displayName}</h1>
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
