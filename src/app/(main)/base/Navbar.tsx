'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IoMdSearch, IoMdPerson, IoMdCamera } from 'react-icons/io';
import { Logo } from '@/components/icons';

export default function Navbar() {
  const [active, setActive] = React.useState(0);

  return (
    <div className='absolute mt-5 flex w-full flex-wrap items-center justify-between gap-2 px-5 text-xs font-medium uppercase opacity-90 md:px-10 z-30'>
      {/* Logo/Brand Section */}
      <motion.div
        className='flex items-center gap-2 font-medium tracking-[4px] text-white'
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <IoMdCamera className='text-xl text-yellow-400' />
        <span className='text-sm md:text-base'>LEHAKOE</span>
      </motion.div>

      {/* Navigation Menu */}
      <ul className='flex flex-wrap items-center gap-3 text-[11px] md:gap-10'>
        {menus.map((menu, index) => {
          return (
            <motion.li
              layout
              key={index}
              className={`${
                active === index && 'border-b-2 border-b-yellow-400'
              } inline-block cursor-pointer border-b-yellow-400 transition duration-300 ease-in-out hover:border-b-2 hover:text-yellow-400 text-white`}
              onClick={() => setActive(index)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {menu}
            </motion.li>
          );
        })}

        {/* Action Icons */}
        <div className='flex items-center gap-6 ml-4'>
          <motion.div
            whileHover={{ scale: 1.1, color: '#fbbf24' }}
            transition={{ duration: 0.2 }}
            className='cursor-pointer'
          >
            <IoMdSearch className='text-lg text-white hover:text-yellow-400 transition-colors' />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, color: '#fbbf24' }}
            transition={{ duration: 0.2 }}
            className='cursor-pointer'
          >
            <IoMdPerson className='text-lg text-white hover:text-yellow-400 transition-colors' />
          </motion.div>
        </div>
      </ul>
    </div>
  );
}

const menus = ['Home', 'Gallery', 'Locations', 'About', 'Contact'];
