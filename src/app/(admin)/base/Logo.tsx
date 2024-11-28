'use client';
import { Image, useMantineColorScheme } from '@mantine/core';
import NextImage from 'next/image';
import NextLink from 'next/link';

export default function Logo() {
  const { colorScheme } = useMantineColorScheme();
  return (
    <NextLink href='/admin'>
      <Image
        alt=''
        src={`/images/logo/${colorScheme === 'dark' ? 'white.png' : 'black.png'}`}
        h={50}
        component={NextImage}
        width={100}
        height={100}
      />
    </NextLink>
  );
}
