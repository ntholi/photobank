'use client';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, useMantineTheme } from '@mantine/core';
import Logo from '@/app/(main)/base/Logo';

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
          <Logo size={50} />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
