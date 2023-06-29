import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GoBell, GoGear, GoHome, GoPerson } from 'react-icons/go';

type Props = {
  username: string;
};

export default function ProfileNav({ username }: Props) {
  const navItems = [
    { name: 'Home', icon: <GoHome />, link: `/` },
    {
      name: 'Profile',
      icon: <GoPerson />,
      link: `./${username}`,
      active: true,
    },
    { name: 'Notifications', icon: <GoBell />, link: `#` },
    { name: 'Settings', icon: <GoGear />, link: `#` },
  ];
  return (
    <nav className='border-e border-zinc-300 h-screen w-1/4'>
      <div className='p-8'>
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
  const activeClass = active ? 'text-black' : 'text-zinc-600';
  return (
    <li key={name} className='group flex items-center p-2'>
      <Link
        href={`/dashboard/${link}`}
        className={`p-2 w-full rounded-sm flex items-center ${activeClass} border-s-2 border-transparent hover:border-zinc-800 hover:text-zinc-800 hover:bg-zinc-50`}
      >
        <span className='mx-3 text-2xl'>{icon}</span>
        <span className='text-lg font-semibold'>{name}</span>
      </Link>
    </li>
  );
};
