'use client';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@nextui-org/react';

import { Link } from '@nextui-org/react';

import { profilePath } from '@/lib/constants';
import { Avatar } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { BiLogOut, BiUser } from 'react-icons/bi';
import { RiDashboardLine } from 'react-icons/ri';
import Logo from './Logo';
import { isExcludePath } from './excludePaths';
import { nameToInitials } from '../(profile)/users/[id]/UserBio';
import { ADMIN_ROLES } from '@/app/old/base/AdminShell';

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Gallery',
    href: '/#gallery',
  },
  {
    label: 'About',
    href: '#',
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [homeStyle, setHomeStyle] = React.useState('');
  const user = session?.user;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkIfHome = () => {
      if (
        (window.scrollY < 100 && pathname === '/') ||
        pathname.includes('/locations/')
      ) {
        setHomeStyle('absolute text-white bg-black/30');
      } else {
        setHomeStyle('');
      }
    };
    checkIfHome();
    const handleScroll = () => {
      checkIfHome();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (isExcludePath(pathname)) {
    return null;
  }

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    gallerySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <NextUINavbar
      maxWidth='xl'
      shouldHideOnScroll
      isBordered
      className={homeStyle}
    >
      <NavbarContent>
        <NavbarMenuToggle className='sm:hidden' />
        <NavbarBrand as='li' className='max-w-fit gap-3'>
          <NextLink
            className='hidden items-center justify-start gap-1 sm:flex'
            href='/'
          >
            <Logo />
          </NextLink>
        </NavbarBrand>
        <ul className='ml-2 hidden justify-start gap-4 sm:flex'>
          {navItems.map((item) => {
            if (item.label == 'Gallery') {
              return (
                <NavbarItem key={item.href}>
                  <button color='foreground' onClick={scrollToGallery}>
                    {item.label}
                  </button>
                </NavbarItem>
              );
            }
            return (
              <NavbarItem key={item.href}>
                <NextLink color='foreground' href={item.href}>
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
        <NavbarItem className='ml-auto'>
          {user ? (
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  size='sm'
                  as='button'
                  className='transition-transform'
                  src={user.image || undefined}
                  name={nameToInitials(user.name)}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label='Profile Actions' variant='flat'>
                <DropdownSection title={user.name || ''} showDivider>
                  <DropdownItem
                    startContent={<BiUser />}
                    onClick={() => router.push(profilePath(user))}
                    key='profile'
                  >
                    My Profile
                  </DropdownItem>
                  {ADMIN_ROLES.includes(session.user?.role) ? (
                    <DropdownItem
                      startContent={<RiDashboardLine />}
                      onClick={() => router.push('/admin')}
                      key='dashboard'
                    >
                      Dashboard
                    </DropdownItem>
                  ) : (
                    <></>
                  )}
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    startContent={<BiLogOut />}
                    onClick={() => signOut()}
                    key='signOut'
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NextLink color='foreground' href={'/signup'}>
              Sign In
            </NextLink>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? 'primary' : 'foreground'}
                href='#'
                size='lg'
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
}
