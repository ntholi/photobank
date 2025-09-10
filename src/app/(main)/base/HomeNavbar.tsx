'use client';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Link } from '@heroui/link';
import { IoMdCamera } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu';
import NotificationsButton from '@/app/components/NotificationsButton';

export default function HomeNavbar() {
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
      router.push('/locations');
    } else if (menu === 'About') {
      console.log('About clicked');
    } else if (menu === 'Contact') {
      console.log('Contact clicked');
    } else if (menu === 'Virtual Tours') {
      router.push('/virtual-tours');
    }
  };

  return (
    <Navbar
      className='absolute z-30 border-none bg-gradient-to-t from-transparent via-black/15 to-transparent py-8'
      classNames={{
        base: 'px-5 md:px-10',
        wrapper: 'max-w-full',
      }}
      isBlurred={false}
      position='static'
    >
      <NavbarBrand className='gap-2 font-medium tracking-[4px]'>
        <Link
          href='/'
          className='flex items-center gap-2 text-white drop-shadow-lg'
        >
          <IoMdCamera className='text-2xl' />
          <span className='text-sm md:text-base'>LEHAKOE</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className='hidden gap-10 md:flex' justify='center'>
        {menus.map((menu, index) => (
          <NavbarItem key={menu}>
            <Link
              className={`${
                active === index
                  ? 'text-primary drop-shadow-lg'
                  : 'text-white/90 drop-shadow-lg'
              } h-auto min-w-fit cursor-pointer px-0 text-xs font-medium tracking-wide uppercase hover:text-white`}
              onClick={() => handleMenuClick(index, menu)}
            >
              {menu}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify='end' className='gap-6'>
        <NavbarItem>
          <div className='[&_button]:text-white [&_button]:drop-shadow-lg [&_button_svg]:text-white'>
            <NotificationsButton />
          </div>
        </NavbarItem>
        <NavbarItem>
          <div className='[&>*]:drop-shadow-lg'>
            <ProfileMenu />
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

const menus = ['Home', 'Gallery', 'Locations', 'Virtual Tours'];
