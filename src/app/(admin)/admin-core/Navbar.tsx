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
import { useEffect, useState } from 'react';
import { UrlObject } from 'url';
import CreateButton from './components/CreateButton';
import DeleteButton from './components/DeleteButton';
import SearchField from './components/SearchField';
import EditButton from './components/EditButton';
import Link from 'next/link';

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
  const [active, setActive] = useState<string | number | undefined>();

  useEffect(() => {
    const link = navLinks.find(({ href }) => pathname.includes(href as string));
    setActive(link?.id);
  }, [pathname]);

  return (
    <>
      <Flex h={60} p="md" justify="space-between">
        <CreateButton href={`${baseUrl}/new`} />
        <Group>
          <DeleteButton
            baseUrl={baseUrl}
            disabled={!active}
            onClick={onDelete}
            id={active}
          />
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
            component={Link}
            href={href as string}
            active={active === id}
          />
        ))}
      </ScrollArea>
    </>
  );
}
