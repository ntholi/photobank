'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from '@headlessui/react';
import { AiFillCaretDown } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const imageUrl = session?.user?.image;
  const position = pathname === '/' ? 'fixed' : 'static';

  return (
    <nav
      className={`${position} z-50 flex w-screen justify-between gap-x-6 border-b border-b-stone-800 bg-black/10 px-6 py-4 text-white backdrop-blur-sm`}
    >
      <div></div>
      <div className="flex">
        <Link href={`/${session?.user?.name}`}>
          <Image
            src={imageUrl ? imageUrl : '/images/profile.png'}
            className="rounded-full border p-1"
            height={30}
            width={30}
            alt="Profile Picture"
          />
        </Link>
        <Menu>
          <Menu.Button>
            <AiFillCaretDown />
          </Menu.Button>
          <Menu.Items className="absolute right-7 top-12 z-50 flex flex-col space-y-1 rounded-lg border bg-white p-3 text-sm text-gray-900 shadow">
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`${active && 'bg-blue-500'}`}
                  href="/account-settings"
                >
                  Profile
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`${active && 'bg-blue-500'}`}
                  href="/account-settings"
                >
                  Settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item disabled>
              <span className="opacity-75">Invite a friend (coming soon!)</span>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
}
export default Header;
