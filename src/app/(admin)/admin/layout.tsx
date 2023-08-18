'use client';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, NavLink, useMantineTheme } from '@mantine/core';
import { IconHome, IconHome2, IconPhoto, IconUser } from '@tabler/icons-react';
import Logo from '@/app/(main)/base/Logo';
import NextLink from 'next/link';

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className="ps-3 md:ps-1 flex items-center">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div className="hidden md:flex items-center gap-3 h-full">
          <Logo size={40} />
          <h1 className="text-xl font-bold">Admin</h1>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Link label="Home" icon={<IconHome />} href="/" />
          <Link label="Photos" icon={<IconPhoto />} href="/admin/photos" />
          <Link label="Users" icon={<IconUser />} href="/admin/users" />
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
