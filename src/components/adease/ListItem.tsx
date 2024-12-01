'use client';

import { NavLink, NavLinkProps } from '@mantine/core';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export interface ListItemProps extends Omit<NavLinkProps, 'component'> {
  id: string | number;
  path?: string;
}

export function ListItem({ id, path, ...props }: ListItemProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <NavLink
      href={`${path}/${id}?${searchParams}`}
      active={pathname.includes(`${path}/${id}`)}
      component={Link}
      {...props}
    />
  );
}
