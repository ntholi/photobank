'use client';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { IoMdSearch, IoMdCamera } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu';

export default function NavbarComponent() {
  const [active, setActive] = React.useState(0);
  const router = useRouter();

  const handleMenuClick = (index: number, menu: string) => {
    setActive(index);

    if (menu === 'Home') {
      router.push('/');
    } else if (menu === 'Gallery') {
      router.push('/#gallery');
    } else if (menu === 'Locations') {
      router.push('/dashboard/locations');
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
      <NavbarBrand className='gap-2 font-medium tracking-[4px] text-gray-900'>
        <IoMdCamera className='text-xl text-primary' />
        <span className='text-sm md:text-base'>LEHAKOE</span>
      </NavbarBrand>

      <NavbarContent className='hidden md:flex gap-10' justify='center'>
        {menus.map((menu, index) => (
          <NavbarItem key={menu}>
            <Link
              className={`${
                active === index ? 'text-primary' : 'text-gray-700'
              } px-0 min-w-fit h-auto font-medium text-xs uppercase tracking-wide cursor-pointer`}
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
            <IoMdSearch className='text-lg' />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ProfileMenu />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

const menus = ['Home', 'Gallery', 'Locations', 'About', 'Contact'];
