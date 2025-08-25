'use client';
import {
  Text,
  Group,
  MantineSize,
  useComputedColorScheme,
} from '@mantine/core';
import Link from 'next/link';
import { IoMdCamera } from 'react-icons/io';

type Props = {
  size?: MantineSize;
};

export default function Logo({ size = 'xs' }: Props) {
  const colorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });
  const sizeMap: Record<MantineSize, number> = {
    xs: 14,
    sm: 18,
    md: 26,
    lg: 40,
    xl: 48,
  };

  return (
    <Link
      href='/dashboard'
      aria-label='Lehakoe dashboard'
      style={{ textDecoration: 'none' }}
    >
      <Group
        component='span'
        align='center'
        gap={'xs'}
        c={colorScheme === 'dark' ? 'white' : 'black'}
      >
        <IoMdCamera size={sizeMap[size]} />
        <Text fw={500} size='xs' lts={2}>
          LEHAKOE
        </Text>
      </Group>
    </Link>
  );
}
