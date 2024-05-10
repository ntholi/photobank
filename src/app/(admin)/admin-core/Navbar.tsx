'use client';
import {
  Divider,
  Flex,
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

export interface NavItem extends NavLinkProps {
  id: string | number;
  href: string | UrlObject;
}

type Props = {
  navLinks: NavItem[];
  baseUrl: string;
  onDelete?: (id: any) => Promise<void>;
};

export default function Navbar({ navLinks, baseUrl, onDelete }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<string | number | null>(null);

  return (
    <>
      <Flex h={60} p="md" justify="space-between">
        <CreateButton href={`${baseUrl}/new`} />
        <DeleteButton
          onClick={async () => {
            await onDelete?.(active);
          }}
        />
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
