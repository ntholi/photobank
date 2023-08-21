'use client';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { useSession } from 'next-auth/react';

type Props = {
  photoURL?: string;
  displayName?: string;
  userId: string;
};

export default function UserBio({ photoURL, displayName, userId }: Props) {
  // const { user } = useSession();

  return <h1>Edit profile/components/UserBio.tsx</h1>;
  // return (
  //   <div className="flex mt-8">
  //     <Image
  //       width={160}
  //       height={160}
  //       referrerPolicy="no-referrer"
  //       src={largeSize(photoURL) || '/images/profile.png'}
  //       className="rounded-full border border-zinc-400"
  //       alt="Profile Picture"
  //     />
  //     <div className="ml-5 sm:ml-16 mt-5">
  //       <h1 className="sm:text-xl font-bold text-zinc-600">{displayName}</h1>
  //       {user?.uid === userId && (
  //         <Button size="sm" className="mt-3" radius="sm">
  //           Edit Profile
  //         </Button>
  //       )}
  //     </div>
  //   </div>
  // );
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
