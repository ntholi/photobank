'use client';

import { useSession } from 'next-auth/react';

function Header() {
  const { data: session } = useSession();

  return (
    <div className="fixed z-50 flex w-screen gap-x-6 border-b border-b-stone-800 bg-black/10 px-6 py-4 text-white backdrop-blur-sm">
      {session?.user?.name}
    </div>
  );
}
export default Header;
