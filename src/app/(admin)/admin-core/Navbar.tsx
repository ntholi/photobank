'use client';
import {
  Divider,
  Flex,
  Group,
  NavLink,
  NavLinkProps,
  ScrollArea,
} from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { UrlObject } from 'url';
import CreateButton from './components/CreateButton';
import DeleteButton from './components/DeleteButton';
import SearchField from './components/SearchField';
import EditButton from './components/EditButton';

export interface NavItem extends NavLinkProps {
  id: string | number;
  href: string | UrlObject;
}

type Props = {
  navLinks: NavItem[];
  baseUrl: string;
  onDelete?: (id: string | number) => Promise<void>;
};

export default function Navbar({ navLinks, baseUrl, onDelete }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<string | number | undefined>();

  return (
    <>
      <Flex h={60} p="md" justify="space-between">
        <CreateButton href={`${baseUrl}/new`} />
        <Group>
          <DeleteButton disabled={!active} onClick={onDelete} id={active} />
          <EditButton disabled={!active} />
        </Group>
      </Flex>
      <SearchField />
      <Divider />
      <ScrollArea h={{ base: 150, sm: '71vh' }} type="always" p={'sm'}>
        {navLinks.map(({ id, href, ...link }) => (
          <NavLink
            key={id}
            {...link}
            onClick={() => {
              setActive(id);
              router.push(href as string);
            }}
            active={pathname.endsWith(href as string)}
          />
        ))}
      </ScrollArea>
    </>
  );
}
