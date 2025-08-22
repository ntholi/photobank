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

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleProfileClick = () => {
    // Navigate to profile page or open profile modal
    console.log('Navigate to profile');
  };

  const handleSettingsClick = () => {
    // Navigate to settings page
    console.log('Navigate to settings');
  };

  const handleFavoritesClick = () => {
    // Navigate to favorites page
    console.log('Navigate to favorites');
  };

  if (isLoading) {
    return (
      <Button
        isIconOnly
        variant='light'
        className='text-white/80 p-0 min-w-fit'
        aria-label='Loading profile'
        disabled
      >
        <div className='w-4 h-4 animate-pulse bg-white/20 rounded-full' />
      </Button>
    );
  }

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='light'
          className='text-white/80 p-0 min-w-fit'
          aria-label={isAuthenticated ? 'User menu' : 'Sign in menu'}
        >
          {isAuthenticated && session.user?.image ? (
            <Avatar
              src={session.user.image}
              size='sm'
              className='w-6 h-6 border-2 border-white/20'
              fallback={<IoMdPerson className='text-lg' />}
            />
          ) : (
            <IoMdPerson className='text-lg' />
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

            <DropdownSection showDivider>
              <DropdownItem
                key='favorites'
                startContent={
                  <IoMdHeart className='text-lg text-default-500' />
                }
                onClick={handleFavoritesClick}
                className='py-2'
              >
                <div className='flex flex-col'>
                  <span className='text-sm'>Favorites</span>
                  <span className='text-xs text-default-400'>
                    Your saved photos
                  </span>
                </div>
              </DropdownItem>

              <DropdownItem
                key='contributions'
                startContent={
                  <IoMdCamera className='text-lg text-default-500' />
                }
                className='py-2'
              >
                <div className='flex flex-col'>
                  <span className='text-sm'>My Contributions</span>
                  <span className='text-xs text-default-400'>
                    Photos you've shared
                  </span>
                </div>
              </DropdownItem>

              <DropdownItem
                key='settings'
                startContent={
                  <IoMdSettings className='text-lg text-default-500' />
                }
                onClick={handleSettingsClick}
                className='py-2'
              >
                <div className='flex flex-col'>
                  <span className='text-sm'>Settings</span>
                  <span className='text-xs text-default-400'>
                    Account preferences
                  </span>
                </div>
              </DropdownItem>
            </DropdownSection>

            <DropdownSection>
              <DropdownItem key='theme-toggle' isReadOnly className='py-2'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-80' />
                    <span className='text-sm'>Theme</span>
                  </div>
                  <ThemeSwitch />
                </div>
              </DropdownItem>

              <DropdownItem
                key='signout'
                startContent={<IoMdLogOut className='text-lg text-danger' />}
                onClick={handleSignOut}
                className='py-2 text-danger'
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
                startContent={<IoMdLogIn className='text-lg text-primary' />}
                onClick={handleGoogleSignIn}
                className='py-3'
              >
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>
                    Continue with Google
                  </span>
                  <span className='text-xs text-default-400'>
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
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-80' />
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
