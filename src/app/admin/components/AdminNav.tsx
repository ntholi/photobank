'use client';
import Logo from '@/app/base/Logo';
import NextLink from 'next/link';
import React from 'react';
import { GoImage, GoPerson } from 'react-icons/go';

export default function ProfileNav() {
  const navItems = [
    { name: 'Users', link: `#`, icon: <GoPerson /> },
    { name: 'Photos', link: `#`, icon: <GoImage /> },
  ];
  return (
    <nav className="z-20 bg-background fixed bottom-0 w-full sm:w-[20vw] sm:h-screen border-t border-t-zinc-100 sm:border-e sm:border-t-0 border-zinc-300">
      <div className="flex items-center gap-5 p-5 border-b border-zinc-300 bg-gray-100 ">
        <Logo size={70} />
        <h1 className="text-2xl font-semibold uppercase font-mono">Admin</h1>
      </div>
      <ul className="flex justify-evenly sm:block">
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
    <li key={name} className="group p-2">
      <NextLink
        href={link}
        className={`p-2 w-full relative rounded-sm flex lg:justify-start justify-center items-center ${activeClass} border border-transparent sm:hover:border-zinc-200 hover:text-zinc-800 hover:bg-zinc-50`}
      >
        <span className="mx-3 text-2xl">{icon}</span>
        <span className="hidden lg:inline text-lg font-semibold">{name}</span>
      </NextLink>
    </li>
  );
};
