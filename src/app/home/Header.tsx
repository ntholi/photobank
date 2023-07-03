'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileDropdown from './ProfileDropdown';

function Header() {
  const { data: session } = useSession();

  const imageUrl = session?.user?.image;

  return (
    <nav className="fixed z-50 flex w-screen justify-between gap-x-6 border-b border-b-stone-800 bg-black/10 px-6 py-4 text-white backdrop-blur-sm">
      <div></div>
      <div className="flex">
        <Image
          src={imageUrl ? imageUrl : '/images/profile.png'}
          height={30}
          width={30}
          alt="Profile Picture"
        />
        <ProfileDropdown />
      </div>
    </nav>
  );
}
export default Header;
