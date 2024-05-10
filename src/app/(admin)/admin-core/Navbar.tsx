'use client';
import {
  Divider,
  Flex,
  NavLink,
  NavLinkProps,
  ScrollArea,
} from '@mantine/core';
import Link from 'next/link';
import { UrlObject } from 'url';
import CreateButton from './components/CreateButton';
import DeleteButton from './components/DeleteButton';
import SearchField from './components/SearchField';
import { useState } from 'react';

type Props = {
  navLinks: NavLinkProps & { href: string | UrlObject }[];
};
export default function Navbar({ navLinks }: Props) {
  const [active, setActive] = useState(0);
  return (
    <>
      <Flex h={60} p="md" justify="space-between">
        <CreateButton href="/admin/categories/new" />
        <DeleteButton />
      </Flex>
      <SearchField />
      <Divider />
      <ScrollArea h={{ base: 150, sm: '71vh' }} type="always" p={'sm'}>
        {navLinks.map((it, index) => (
          <NavLink component={Link} key={index} {...it} />
        ))}
      </ScrollArea>
    </>
  );
}
