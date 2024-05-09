'use client';
import { auth } from '@/lib/config/firebase';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  NavLink,
  ScrollArea,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconChevronRight,
  IconFileDescription,
  IconLogout2,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { useSession } from '../auth/SessionProvider';
import AccessDenied from './AccessDenied';
import Logo from './Logo';
import Navigation from './Navigation';

export default function AdminShell({ children }: PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const { status } = useSession();
  const router = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('dark');

  // if (status == 'loading') {
  //   return (
  //     <Flex h='100vh' w='100vw' justify='center' align='center'>
  //       <LoadingOverlay visible />
  //     </Flex>
  //   );
  // } else if (status == 'unauthenticated') {
  //   router.push('/auth/signin');
  //   return null;
  // }

  const hasAccess = true; //user?.role === 'admin';

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: hasAccess ? 300 : 0,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              size="sm"
            />
            <Logo size="sm" />
          </Group>
          <ActionIcon variant="default" size="lg">
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
