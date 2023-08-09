'use client';
import { useSession } from '@/lib/context/UserContext';
import { Avatar } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GoBell, GoGear, GoHome, GoPerson } from 'react-icons/go';
import { nameToInitials } from './UserBio';

export default function ProfileNav() {
  const { user } = useSession();

  const navItems = [
    { name: 'Home', icon: <GoHome />, link: `/` },
    { name: 'Notifications', icon: <GoBell />, link: `#` },
    { name: 'Settings', icon: <GoGear />, link: `#` },
  ];
  return (
    <nav className="border-e border-zinc-300 h-screen w-1/4">
      <div className="p-8">
        <Image alt="logo" src="/images/logo.jpg" width={100} height={100} />
      </div>
      <ul>
        {navItems.map((item) => (
          <NevItem key={item.name} {...item} />
        ))}
        <NevItem
          name="Profile"
          icon={
            <Avatar
              isBordered
              className="w-5 h-5"
              src={user?.photoURL || undefined}
            />
          }
          link={`../profile/${user?.uid}`}
          active
        />
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
      <Link
        href={link}
        className={`p-2 w-full rounded-sm flex md:justify-start justify-center items-center ${activeClass} border-s-2 border-transparent hover:border-zinc-800 hover:text-zinc-800 hover:bg-zinc-50`}
      >
        <span className="mx-3 text-2xl">{icon}</span>
        <span className="hidden md:inline text-lg font-semibold">{name}</span>
      </Link>
    </li>
  );
};
