'use client';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/button';
import { IoMdSearch, IoMdPerson, IoMdCamera } from 'react-icons/io';

export default function NavbarComponent() {
  const [active, setActive] = React.useState(0);

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
          <NavbarItem key={index}>
            <Button
              variant='light'
              className={`${
                active === index ? 'border-b-2 border-primary' : ''
              } text-white hover:text-primary hover:border-b-2 hover:border-primary transition-all duration-300 ease-in-out px-0 min-w-fit h-auto font-medium text-xs uppercase tracking-wide`}
              onClick={() => setActive(index)}
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
            className='text-white hover:text-primary transition-colors p-0 min-w-fit'
            aria-label='Search'
          >
            <IoMdSearch className='text-lg' />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            isIconOnly
            variant='light'
            className='text-white hover:text-primary transition-colors p-0 min-w-fit'
            aria-label='Profile'
          >
            <IoMdPerson className='text-lg' />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

const menus = ['Home', 'Gallery', 'Locations', 'About', 'Contact'];
