'use client';

import { Avatar, Button, Divider } from '@nextui-org/react';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import { GoBell, GoGear, GoHome, GoUpload } from 'react-icons/go';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ProfileNav() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  const user = session?.user;

  const navItems = [
    { name: 'Home', link: `/`, icon: <GoHome /> },
    { name: 'Notifications', link: `#`, icon: <GoBell /> },
    { name: 'Settings', link: `#`, icon: <GoGear /> },
    {
      name: 'Profile',
      link: `/profile/${user?.username}`,
      icon: (
        <Avatar
          isBordered
          className="w-5 h-5 ms-1 me-0.5"
          src={user?.image || undefined}
        />
      ),
      active: true,
    },
  ];
  return (
    <nav className="z-50 bg-background fixed bottom-0 w-full sm:w-[20vw] sm:h-screen border-t border-t-zinc-100 sm:border-e sm:border-t-0 border-zinc-300">
      <Link href={'/'} className="inline-block p-8 max-sm:hidden">
        <Image alt="logo" src="/images/logo.jpg" width={100} height={100} />
      </Link>
      <ul className="flex justify-evenly sm:block">
        {navItems.map((item) => (
          <NevItem key={item.name} {...item} />
        ))}
        <div className="p-5 max-md:hidden">
          <Divider />
        </div>
        <li className="p-2 md:ps-6 md:pe-10 max-md:text-center">
          <Button
            startContent={!isMobile && <GoUpload />}
            variant="ghost"
            isIconOnly={isMobile}
            href={`/profile/${user?.username}/uploads/new`}
            as={NextLink}
            className="md:px-8 border-1.5 rounded-full md:rounded-md"
          >
            {isMobile ? <GoUpload /> : 'Upload'}
          </Button>
        </li>
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
    <li key={name} className="group p-2">
      <NextLink
        href={link}
        className={`p-2 w-full relative rounded-sm flex lg:justify-start justify-center items-center ${activeClass} border-s-2 border-transparent sm:hover:border-zinc-800 hover:text-zinc-800 hover:bg-zinc-50`}
      >
        <span className="mx-3 text-2xl">{icon}</span>
        <span className="hidden lg:inline text-lg font-semibold">{name}</span>
      </NextLink>
    </li>
  );
};
