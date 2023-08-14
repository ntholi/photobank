'use client';
import { useSession } from '@/lib/context/UserContext';
import {
  Avatar,
  Button,
  Divider,
  Modal,
  useDisclosure,
} from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GoBell, GoGear, GoHome, GoUpload } from 'react-icons/go';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import UploadModel from './upload/UploadModel';

export default function ProfileNav() {
  const { user } = useSession();
  const isMobile = useIsMobile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navItems = [
    { name: 'Home', link: `/`, icon: <GoHome /> },
    { name: 'Notifications', link: `#`, icon: <GoBell /> },
    { name: 'Settings', link: `#`, icon: <GoGear /> },
    {
      name: 'Profile',
      link: `../profile/${user?.uid}`,
      icon: (
        <Avatar
          isBordered
          className="w-5 h-5 ms-1 me-0.5"
          src={user?.photoURL || undefined}
        />
      ),
      active: true,
    },
  ];
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <UploadModel />
      </Modal>
      <nav className="bg-background fixed bottom-0 w-full sm:w-1/4 sm:h-screen sm:static border-t border-t-zinc-100 sm:border-e sm:border-t-0 border-zinc-300">
        <div className="p-8 max-sm:hidden">
          <Image alt="logo" src="/images/logo.jpg" width={100} height={100} />
        </div>
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
              className="md:px-8 border-1.5 rounded-full md:rounded-md"
              onPress={onOpen}
            >
              {isMobile ? <GoUpload /> : 'Upload'}
            </Button>
          </li>
        </ul>
      </nav>
    </>
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
        className={`p-2 w-full relative rounded-sm flex md:justify-start justify-center items-center ${activeClass} border-s-2 border-transparent sm:hover:border-zinc-800 hover:text-zinc-800 hover:bg-zinc-50`}
      >
        <span className="mx-3 text-2xl">{icon}</span>
        <span className="hidden md:inline text-lg font-semibold">{name}</span>
        {/* <PiArrowRightBold className="absolute right-5 group-hover:inline group-hover:translate-x-3 transition-transform group-hover:text-zinc-500 text-zinc-200" /> */}
      </Link>
    </li>
  );
};