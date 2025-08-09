'use client';
import { Image, MantineSize, useComputedColorScheme } from '@mantine/core';
import NextImage from 'next/image';
import Link from 'next/link';

type Props = {
  size?: MantineSize;
};

export default function Logo({ size = 'xs' }: Props) {
  const colorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });
  const logo =
    colorScheme === 'dark' ? '/logo/white.png' : '/logo/transparent.png';

  const sizeMap = {
    xs: 30,
    sm: 40,
    md: 60,
    lg: 80,
    xl: 100,
  };

  return (
    <Link href='/admin'>
      <Image
        h={sizeMap[size]}
        component={NextImage}
        w={'auto'}
        width={sizeMap[size] * 7}
        height={sizeMap[size] * 7}
        src={logo}
        alt='Logo'
      />
    </Link>
  );
}
