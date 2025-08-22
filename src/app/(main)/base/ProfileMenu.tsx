'use client';

import React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { Button } from '@heroui/button';
import { IoMdPerson } from 'react-icons/io';
import { signIn } from 'next-auth/react';
import { ThemeSwitch } from '@/components/theme-switch';

export default function ProfileMenu() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='light'
          className='text-white/80 hover:text-white p-0 min-w-fit'
          aria-label='Profile menu'
        >
          <IoMdPerson className='text-lg' />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile menu' className='min-w-[200px]'>
        <DropdownItem
          key='google-signin'
          onClick={handleGoogleSignIn}
          className='text-default-700'
        >
          Continue with Google
        </DropdownItem>
        <DropdownItem
          key='theme-toggle'
          isReadOnly
          className='text-default-700'
        >
          <div className='flex items-center justify-between w-full'>
            <span>Theme</span>
            <ThemeSwitch />
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
