'use client';
import {
  ActionIcon,
  AppShell,
  Burger,
  Flex,
  Group,
  LoadingOverlay,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useSession } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import AccessDenied from './AccessDenied';
import Logo from './Logo';
import Navigation from './Navigation';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function AdminShell({ children }: PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const { status, data: session } = useSession();
  const colorScheme = useComputedColorScheme('dark');
  const { setColorScheme } = useMantineColorScheme();
  const router = useRouter();

  if (status == 'loading') {
    return (
      <Flex h='100vh' w='100vw' justify='center' align='center'>
        <LoadingOverlay visible />
      </Flex>
    );
  }

  if (!session?.user) {
    router.push('api/auth/signin');
  }

  const roles: (Role | undefined)[] = ['admin', 'moderator'];
  const hasAccess = roles.includes(session?.user?.role);

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
          <ActionIcon variant='default' size='lg'>
            {colorScheme === 'dark' ? (
              <IconSun onClick={() => setColorScheme('light')} />
            ) : (
              <IconMoon onClick={() => setColorScheme('dark')} />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      {hasAccess && <Navigation />}
      <AppShell.Main bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'}>
        {hasAccess ? children : <AccessDenied />}
      </AppShell.Main>
    </AppShell>
  );
}
