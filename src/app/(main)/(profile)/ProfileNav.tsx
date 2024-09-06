'use client';

import { profilePath } from '@/lib/constants';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { Avatar, Button, Divider } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { default as Link, default as NextLink } from 'next/link';
import React from 'react';
import {
  GoBell,
  GoGear,
  GoHome,
  GoSignIn,
  GoSignOut,
  GoUpload,
} from 'react-icons/go';

export default function ProfileNav() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  const user = session?.user;

  const navItems = [
    { name: 'Notifications', link: `#`, icon: <GoBell /> },
    { name: 'Settings', link: `#`, icon: <GoGear /> },
    {
      name: 'Profile',
      link: profilePath(user),
      icon: (
        <Avatar
          isBordered
          className='me-0.5 ms-1 h-5 w-5'
          src={user?.image || undefined}
        />
      ),
      active: true,
    },
  ];
  return (
    <nav className='fixed bottom-0 z-50 w-full border-t border-zinc-300 border-t-zinc-100 bg-background sm:h-screen sm:w-[20vw] sm:border-e sm:border-t-0'>
      <Link href={'/'} className='inline-block p-8 max-sm:hidden'>
        <Image
          alt='logo'
          src='/images/logo/black.png'
          width={100}
          height={100}
        />
      </Link>
      <ul className='flex justify-evenly sm:block'>
        <NevItem name='Home' link='/' icon={<GoHome />} />
        {!session?.user ? (
          <li className='p-2 max-md:text-center md:pe-10 md:ps-6'>
            <Button
              variant='ghost'
              href={`/signup`}
              as={NextLink}
              className='rounded-full border-1.5 md:rounded-md md:px-8'
            >
              <GoSignIn /> Sign In
            </Button>
          </li>
        ) : (
          <>
            {navItems.map((item) => (
              <NevItem key={item.name} {...item} />
            ))}

            <div className='p-5 max-md:hidden'>
              <Divider />
            </div>

            <li className='p-2 max-md:text-center md:pe-10 md:ps-6'>
              <Button
                startContent={!isMobile && <GoUpload />}
                variant='ghost'
                isIconOnly={isMobile}
                href={`/upload`}
                as={NextLink}
                className='rounded-full border-1.5 md:rounded-md md:px-8'
              >
                {isMobile ? <GoUpload /> : 'Upload'}
              </Button>
            </li>

            <li className='absolute bottom-2 p-2 max-sm:hidden'>
              <button
                onClick={() => signOut()}
                className={`flex w-full items-center justify-center p-2 text-gray-600 hover:text-black md:justify-start`}
              >
                <span className='mx-3'>
                  <GoSignOut />
                </span>
                <span className='hidden font-semibold lg:inline'>Sign Out</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

type NavItemProps = {
  name: string;
  icon: React.ReactNode;
  link: string;
  active?: boolean;
};

const NevItem = ({ name, icon, link, active }: NavItemProps) => {
  const activeClass = active ? 'text-black' : 'text-zinc-600';
  return (
    <li key={name} className='group p-2'>
      <NextLink
        href={link}
        className={`relative flex w-full items-center justify-center rounded-sm p-2 lg:justify-start ${activeClass} hover:bg-zinc-50 hover:text-zinc-800 sm:hover:border-zinc-800`}
      >
        <span className='mx-3 text-2xl transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:font-bold'>
          {icon}
        </span>
        <span className='hidden text-lg font-semibold lg:inline'>{name}</span>
      </NextLink>
    </li>
  );
};
