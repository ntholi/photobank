'use client';

import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { IoMdCamera, IoMdSearch } from 'react-icons/io';
import ProfileMenu from './ProfileMenu';

const menus = ['Home', 'Gallery', 'Locations', 'About', 'Contact'];

export default function NavbarComponent() {
  const [active, setActive] = React.useState(0);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    menus.forEach((menu, index) => {
      if (path.toLowerCase().includes(menu.toLowerCase())) {
        setActive(index);
      }
    });
  }, [path]);

  const handleMenuClick = (index: number, menu: string) => {
    setActive(index);

    if (menu === 'Home') {
      router.push('/');
    } else if (menu === 'Gallery') {
      router.push('/#gallery');
    } else if (menu === 'Locations') {
      router.push('/locations');
    } else if (menu === 'About') {
      console.log('About clicked');
    } else if (menu === 'Contact') {
      console.log('Contact clicked');
    }
  };

  return (
    <Navbar
      classNames={{
        base: 'px-5 md:px-10',
        wrapper: 'max-w-full',
      }}
    >
      <NavbarBrand className='font-medium tracking-[4px]'>
        <Link href='/' className='text-foreground flex items-center gap-2'>
          <IoMdCamera className='text-2xl' />
          <span className='text-sm md:text-base'>LEHAKOE</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className='hidden gap-10 md:flex' justify='center'>
        {menus.map((menu, index) => (
          <NavbarItem key={menu}>
            <Link
              className={`${
                active === index ? 'text-primary' : 'text-foreground/80'
              } h-auto min-w-fit cursor-pointer px-0 text-xs font-medium tracking-wide uppercase`}
              onClick={() => handleMenuClick(index, menu)}
            >
              {menu}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify='end' className='gap-6'>
        <NavbarItem>
          <Button isIconOnly variant='light' radius='full' aria-label='Search'>
            <IoMdSearch className='text-foreground text-lg' />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ProfileMenu />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
