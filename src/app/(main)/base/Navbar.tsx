'use client';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/button';
import { IoMdSearch, IoMdCamera } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu';

export default function NavbarComponent() {
  const [active, setActive] = React.useState(0);
  const router = useRouter();

  const handleMenuClick = (index: number, menu: string) => {
    setActive(index);

    if (menu === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (menu === 'Gallery') {
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push('/');
        setTimeout(() => {
          const element = document.getElementById('gallery');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
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
      className='absolute mt-5 bg-transparent border-none z-30'
      classNames={{
        base: 'px-5 md:px-10',
        wrapper: 'max-w-full',
      }}
      isBlurred={false}
      position='static'
    >
      <NavbarBrand className='gap-2 font-medium tracking-[4px] text-white'>
        <IoMdCamera className='text-xl text-primary' />
        <span className='text-sm md:text-base'>LEHAKOE</span>
      </NavbarBrand>

      <NavbarContent className='hidden md:flex gap-10' justify='center'>
        {menus.map((menu, index) => (
          <NavbarItem key={menu}>
            <Button
              variant='light'
              className={`${
                active === index ? 'text-primary' : 'text-white/80'
              } hover:text-white px-0 min-w-fit h-auto font-medium text-xs uppercase tracking-wide`}
              onClick={() => handleMenuClick(index, menu)}
            >
              {menu}
            </Button>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify='end' className='gap-6'>
        <NavbarItem>
          <Button
            isIconOnly
            variant='light'
            className='text-white/80 hover:text-white p-0 min-w-fit'
            aria-label='Search'
          >
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
