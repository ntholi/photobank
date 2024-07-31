'use client';
import {
  AppShell,
  Burger,
  Flex,
  Group,
  LoadingOverlay,
  useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useSession } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import AccessDenied from './AccessDenied';
import Logo from './Logo';
import Navigation from './Navigation';

export default function AdminShell({ children }: PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const { status } = useSession();
  const colorScheme = useComputedColorScheme('dark');

  if (status == 'loading') {
    return (
      <Flex h='100vh' w='100vw' justify='center' align='center'>
        <LoadingOverlay visible />
      </Flex>
    );
  }

  const hasAccess = true; //user?.role === 'admin';

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: hasAccess ? 300 : 0,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='md'
              size='sm'
            />
            <Logo />
          </Group>
        </Group>
      </AppShell.Header>
      {hasAccess && <Navigation />}
      <AppShell.Main bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'}>
        {hasAccess ? children : <AccessDenied />}
      </AppShell.Main>
    </AppShell>
  );
}
