'use client';

import { NavLink, NavLinkProps } from '@mantine/core';
import { usePathname } from 'next/navigation';

export interface ListItemProps extends Omit<NavLinkProps, 'component'> {
  id: string | number;
  path?: string;
}

export function ListItem({ id, path, onClick, ...props }: ListItemProps) {
  const pathname = usePathname();
  return (
    <NavLink
      active={pathname.includes(`${path}/${id}`)}
      onClick={onClick}
      {...props}
    />
  );
}
