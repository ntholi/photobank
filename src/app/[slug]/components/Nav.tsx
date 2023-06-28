import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  GoBell,
  GoBellFill,
  GoGear,
  GoHome,
  GoHomeFill,
  GoPerson,
  GoPersonFill,
} from 'react-icons/go';

type Props = {
  username: string;
};

export default function ProfileNav({ username }: Props) {
  const navItems = [
    { name: 'Home', icon: <GoHome />, link: `/` },
    { name: 'Profile', icon: <GoPerson />, link: `./${username}` },
    { name: 'Notifications', icon: <GoBell />, link: `#` },
    { name: 'Settings', icon: <GoGear />, link: `#` },
  ];
  return (
    <nav className='border-e h-screen w-1/4'>
      <div className='flex justify-center p-8'>
        <Image alt='logo' src='/images/logo.jpg' width={100} height={100} />
      </div>
      <ul>
        {navItems.map((item) => (
          <NevItem key={item.name} {...item} />
        ))}
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
  const color = active ? 'text-black' : 'text-zinc-600';
  return (
    <li key={name} className='group flex items-center p-2'>
      <Link
        href={`/dashboard/${link}`}
        className={`p-2 w-full rounded-sm flex items-center ${color} border-s-2 border-transparent hover:border-zinc-800 hover:text-zinc-800 hover:bg-zinc-50`}
      >
        <span className='mx-3 text-2xl'>{icon}</span>
        <span className='text-lg font-semibold'>{name}</span>
      </Link>
    </li>
  );
};
