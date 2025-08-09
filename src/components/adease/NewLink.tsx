'use client';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { IconPlus } from '@tabler/icons-react';

export interface NewLinkProps extends ActionIconProps {
  href: string;
}

export default function NewLink({ href, ...props }: NewLinkProps) {
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('view', 'details');

  const finalHref = `${href}?${newSearchParams.toString()}`;

  return (
    <ActionIcon
      size={'lg'}
      variant='default'
      href={finalHref}
      component={Link}
      {...props}
    >
      <IconPlus />
    </ActionIcon>
  );
}
