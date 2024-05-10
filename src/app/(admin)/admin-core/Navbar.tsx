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
import { useRouter } from 'next/navigation';

type Props = {
  navLinks: NavLinkProps & { id: string | number; href: string | UrlObject }[];
};
export default function Navbar({ navLinks }: Props) {
  const [active, setActive] = useState<string | number | undefined>();
  const router = useRouter();
  return (
    <>
      <Flex h={60} p="md" justify="space-between">
        <CreateButton href="/admin/categories/new" />
        <DeleteButton />
      </Flex>
      <SearchField />
      <Divider />
      <ScrollArea h={{ base: 150, sm: '71vh' }} type="always" p={'sm'}>
        {navLinks.map(({ id, href, ...link }) => (
          <NavLink
            key={id}
            {...link}
            active={active === id}
            onClick={() => {
              setActive(id);
              router.push(href as string);
            }}
          />
        ))}
      </ScrollArea>
    </>
  );
}
