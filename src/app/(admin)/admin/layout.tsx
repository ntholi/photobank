'use client';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Flex, NavLink, Title } from '@mantine/core';
import { IconCash, IconHome, IconPhoto, IconUser } from '@tabler/icons-react';
import Logo from '@/app/(main)/base/Logo';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const session = useSession();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Flex h={'100%'} align="center" visibleFrom="sm" gap="md" ml="xs">
          <Logo size={40} />
          <Title order={3} tt="capitalize">
            {session.data?.user?.role}
          </Title>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Link label="Home" icon={<IconHome />} href="/" />
          <Link label="Photos" icon={<IconPhoto />} href="/admin/photos" />
          <Link label="Payments" icon={<IconCash />} href="#" />
          <Link label="Users" icon={<IconUser />} href="#" />
        </AppShell.Section>
        <AppShell.Section>Sign Out</AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

const Link = ({
  label,
  icon,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) => (
  <NavLink label={label} leftSection={icon} href={href} component={NextLink} />
);
