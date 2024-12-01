import { ActionIcon, ActionIconProps } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { IconPlus } from '@tabler/icons-react';

export interface NewLinkProps extends ActionIconProps {
  href: string;
}

export default function NewLink({ href, ...props }: NewLinkProps) {
  return (
    <ActionIcon
      size={'lg'}
      variant='default'
      href={href}
      component={Link}
      {...props}
    >
      <IconPlus />
    </ActionIcon>
  );
}
