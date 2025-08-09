'use client';

import { Shell } from '@/components/adease';
import { ActionIcon, Avatar, Flex, Group, Stack, Text, LoadingOverlay, Image } from '@mantine/core';
import { modals } from '@mantine/modals';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Icon, IconChevronRight, IconLogout2, IconUsers } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { Indicator, NavLink } from '@mantine/core';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

type NotificationConfig = {
  queryKey: string[];
  queryFn: () => Promise<number>;
};

export type NavItem = {
  label: string;
  href?: string;
  icon: Icon;
  children?: NavItem[];
  notificationCount?: NotificationConfig;
};

const navigation: NavItem[] = [
  {
    label: 'Users',
    href: '/admin/users',
    icon: IconUsers,
  },
];

export default function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <Flex h='100vh' w='100vw' justify='center' align='center'>
        <LoadingOverlay visible />
      </Flex>
    );
  }

  return (
    <Shell>
      <Shell.Header>
        <Group>
          <Image src={'/images/logo.png'} height={40} alt='logo' />
        </Group>
      </Shell.Header>
      <Shell.Navigation>
        <Navigation navigation={navigation} />
      </Shell.Navigation>
      <Shell.Body>{children}</Shell.Body>
      <Shell.User>
        <UserButton />
      </Shell.User>
    </Shell>
  );
}

function UserButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    router.push('/api/auth/signin');
  }

  const openModal = () =>
    modals.openConfirmModal({
      centered: true,
      title: 'Confirm logout',
      children: 'Are you sure you want to logout?',
      confirmProps: { color: 'dark' },
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      onConfirm: async () => await signOut(),
    });

  return (
    <Flex mt={'md'} mb={'sm'} justify='space-between' align={'center'}>
      <Group>
        <Avatar src={session?.user?.image} />
        <Stack gap={5}>
          <Text size='0.9rem'>{session?.user?.name}</Text>
          <Text size='0.7rem' c={'dimmed'}>
            {session?.user?.email}
          </Text>
        </Stack>
      </Group>
      <ActionIcon variant='default' size={'lg'}>
        <IconLogout2 size='1rem' onClick={openModal} />
      </ActionIcon>
    </Flex>
  );
}

export function Navigation({ navigation }: { navigation: NavItem[] }) {
  return (
    <>
      {navigation.map((item, index) => (
        <DisplayWithNotification key={index} item={item} />
      ))}
    </>
  );
}

function DisplayWithNotification({ item }: { item: NavItem }) {
  const { data: notificationCount = 0 } = useQuery({
    queryKey: item.notificationCount?.queryKey ?? [],
    queryFn: () => item.notificationCount?.queryFn() ?? Promise.resolve(0),
    enabled: !!item.notificationCount,
  });

  return (
    <Indicator
      position='middle-end'
      color='red'
      offset={20}
      size={23}
      label={notificationCount}
      disabled={!notificationCount}
    >
      <ItemDisplay item={item} />
    </Indicator>
  );
}

function ItemDisplay({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const Icon = item.icon;

  const navLink = (
    <NavLink
      label={item.label}
      component={item.href ? Link : undefined}
      href={item.href || ''}
      active={item.href ? pathname.startsWith(item.href) : false}
      leftSection={<Icon size='1.1rem' />}
      rightSection={item.href ? <IconChevronRight size='0.8rem' stroke={1.5} /> : undefined}
      opened={!!item.children}
    >
      {item.children?.map((child, index) => (
        <DisplayWithNotification key={index} item={child} />
      ))}
    </NavLink>
  );
  return navLink;
}