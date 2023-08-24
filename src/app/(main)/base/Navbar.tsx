'use client';
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@nextui-org/react';

import { Link } from '@nextui-org/link';

import { link as linkStyles } from '@nextui-org/theme';

import NextLink from 'next/link';
import clsx from 'clsx';
import Logo from './Logo';
import { Avatar } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { BiLogOut, BiUser } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { nameToInitials } from '../[username]/UserBio';
import commonUrlPatterns from '@/app/api/signup/commonUrlPatterns';
import React, { useEffect } from 'react';

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Browse',
    href: '/#gallery',
  },
  {
    label: 'About',
    href: '#',
  },
];

const isAppPath = (pathname: string) => {
  return (
    pathname === '/' || commonUrlPatterns.includes(pathname.replace('/', ''))
  );
};

export default function Navbar() {
  const { data: session } = useSession();
  const [homeStyle, setHomeStyle] = React.useState('');
  const user = session?.user;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkIfHome = () => {
      if (window.scrollY < 100 && pathname === '/') {
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

  if (!isAppPath(pathname)) {
    return null;
  }

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    gallerySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      shouldHideOnScroll
      isBordered
      className={homeStyle}
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="hidden sm:flex justify-start items-center gap-1"
            href="/"
          >
            <Logo />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden sm:flex gap-4 justify-start ml-2">
          {navItems.map((item) => {
            if (item.label == 'Browse') {
              return (
                <NavbarItem key={item.href}>
                  <button color="foreground" onClick={scrollToGallery}>
                    {item.label}
                  </button>
                </NavbarItem>
              );
            }
            return (
              <NavbarItem key={item.href}>
                <NextLink color="foreground" href={item.href}>
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
        <NavbarItem className="ml-auto">
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  size="sm"
                  as="button"
                  className="transition-transform"
                  src={user.image || undefined}
                  name={nameToInitials(user.name)}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownSection title={user.name || ''} showDivider>
                  <DropdownItem
                    startContent={<BiUser />}
                    onClick={() => router.push(`/${user.username}`)}
                    key="profile"
                  >
                    View Profile
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    startContent={<BiLogOut />}
                    onClick={() => signOut()}
                    key="signOut"
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NextLink color="foreground" href={'/signup'}>
              Sign In
            </NextLink>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? 'primary' : 'foreground'}
                href="#"
                size="lg"
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
