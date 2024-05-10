'use client';
import {
  Divider,
  Flex,
  NavLink,
  NavLinkProps,
  ScrollArea,
} from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UrlObject } from 'url';
import CreateButton from './components/CreateButton';
import DeleteButton from './components/DeleteButton';
import SearchField from './components/SearchField';

type Props = {
  navLinks: NavLinkProps & { id: string | number; href: string | UrlObject }[];
};
export default function Navbar({ navLinks }: Props) {
  const pathname = usePathname();
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
            href={href}
            component={Link}
            {...link}
            active={pathname.endsWith(href as string)}
          />
        ))}
      </ScrollArea>
    </>
  );
}
