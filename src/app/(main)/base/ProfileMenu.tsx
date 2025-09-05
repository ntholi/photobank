'use client';

import React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@heroui/dropdown';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import { User } from '@heroui/user';
import {
  IoMdPerson,
  IoMdLogIn,
  IoMdLogOut,
  IoMdSettings,
  IoMdHeart,
  IoMdCamera,
} from 'react-icons/io';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ThemeSwitch } from '@/components/theme-switch';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const path = usePathname();
  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (isLoading) {
    return (
      <Button
        isIconOnly
        variant='light'
        className='text-foreground/80 min-w-fit p-0'
        aria-label='Loading profile'
        disabled
      >
        <div className='bg-foreground/20 h-4 w-4 animate-pulse rounded-full' />
      </Button>
    );
  }

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button
          isIconOnly
          radius='full'
          variant='light'
          className='text-foreground/80 min-w-fit p-0'
          aria-label={isAuthenticated ? 'User menu' : 'Sign in menu'}
        >
          {isAuthenticated && session.user?.image ? (
            <Avatar
              src={session.user.image}
              size='sm'
              className='border-default-300 border-2'
              fallback={<IoMdPerson className='text-lg' />}
            />
          ) : (
            <IoMdPerson
              className={cn('text-lg', path === '/' && 'text-white')}
            />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={isAuthenticated ? 'User menu' : 'Authentication menu'}
        className='min-w-[220px] p-2'
        variant='flat'
      >
        {isAuthenticated ? (
          <>
            <DropdownSection showDivider>
              <DropdownItem
                key='profile'
                className='h-auto py-3'
                textValue='Profile'
                as={Link}
                href={`/profile/${session.user?.id}`}
              >
                <User
                  name={session.user?.name || 'User'}
                  description={session.user?.email || ''}
                  avatarProps={{
                    src: session.user?.image || '',
                    size: 'sm',
                    className: 'flex-shrink-0',
                    fallback: <IoMdPerson className='text-lg' />,
                  }}
                  classNames={{
                    name: 'text-sm font-medium',
                    description: 'text-xs text-default-500',
                  }}
                />
              </DropdownItem>
            </DropdownSection>

            {['contributor', 'moderator', 'admin'].includes(
              session.user?.role || '',
            ) && (
              <DropdownSection showDivider>
                <DropdownItem
                  key='uploads'
                  as={Link}
                  href={`/profile/${session.user?.id}/uploads`}
                  startContent={
                    <IoMdCamera className='text-default-500 text-lg' />
                  }
                  className='py-2'
                >
                  <div className='flex flex-col'>
                    <span className='text-sm'>Upload</span>
                    <span className='text-default-400 text-xs'>
                      Upload your content
                    </span>
                  </div>
                </DropdownItem>
              </DropdownSection>
            )}
            <DropdownSection>
              <DropdownItem key='theme-toggle' isReadOnly className='py-2'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-80' />
                    <span className='text-sm'>Theme</span>
                  </div>
                  <ThemeSwitch />
                </div>
              </DropdownItem>

              <DropdownItem
                key='signout'
                startContent={<IoMdLogOut className='text-danger text-lg' />}
                onClick={handleSignOut}
                className='text-danger py-2'
              >
                <span className='text-sm'>Sign Out</span>
              </DropdownItem>
            </DropdownSection>
          </>
        ) : (
          <>
            <DropdownSection showDivider>
              <DropdownItem
                key='google-signin'
                startContent={<IoMdLogIn className='text-primary text-lg' />}
                onClick={handleGoogleSignIn}
                className='py-3'
              >
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>
                    Continue with Google
                  </span>
                  <span className='text-default-400 text-xs'>
                    Access your account
                  </span>
                </div>
              </DropdownItem>
            </DropdownSection>

            <DropdownSection>
              <DropdownItem
                key='theme-toggle'
                className='cursor-default py-2 hover:bg-transparent data-[hover=true]:bg-transparent'
                isReadOnly
              >
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-80' />
                    <span className='text-sm'>Theme</span>
                  </div>
                  <ThemeSwitch />
                </div>
              </DropdownItem>
            </DropdownSection>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
