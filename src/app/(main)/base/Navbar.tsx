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

import commonUrlPatterns from '@/app/api/users/commonUrlPatterns';
import { profilePath } from '@/lib/constants';
import { Avatar } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { BiLogOut, BiUser } from 'react-icons/bi';
import { nameToInitials } from '../users/[id]/UserBio';
import Logo from './Logo';

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
  const name = pathname.split('/')[1];
  return pathname === '/' || commonUrlPatterns.includes(name.replace('/', ''));
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
                    onClick={() => router.push(profilePath(user))}
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
