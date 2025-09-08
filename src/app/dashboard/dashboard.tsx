'use client';

import { Shell } from '@/components/adease';
import {
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Indicator,
  LoadingOverlay,
  MantineColor,
  NavLink,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  Icon,
  IconCardboards,
  IconChevronRight,
  IconFile,
  IconHome,
  IconLogout2,
  IconMapPin,
  IconNotification,
  IconPhoto,
  IconTags,
  IconUsers,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';
import Logo from './base/Logo';
import { Session } from 'next-auth';
import { UserRole } from '@/db/schema';

type NotificationConfig = {
  queryKey: string[];
  queryFn: () => Promise<number>;
  refetchInterval?: number;
  color?: MantineColor;
};

export type NavItem = {
  label: string;
  href?: string;
  icon?: Icon;
  description?: string;
  roles?: UserRole[];
  isVisible?: (session: Session | null) => boolean;
  children?: NavItem[];
  notificationCount?: NotificationConfig;
  isLoading?: boolean;
};

const navigation: NavItem[] = [
  {
    label: 'Home',
    href: '/dashboard/home-content',
    icon: IconHome,
    roles: ['admin'],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: IconUsers,
    roles: ['admin'],
  },
  {
    label: 'Content',
    href: '/dashboard/content',
    icon: IconPhoto,
    roles: ['moderator', 'admin'],
  },
  {
    label: 'Virtual Tours',
    href: '/dashboard/virtual-tours',
    icon: IconCardboards,
    roles: ['admin'],
  },
  {
    label: 'Tags',
    href: '/dashboard/tags',
    icon: IconTags,
    roles: ['admin'],
  },
  {
    label: 'Locations',
    href: '/dashboard/locations',
    icon: IconMapPin,
    roles: ['moderator', 'admin'],
  },
  {
    label: 'Notifications',
    href: '/dashboard/notifications',
    icon: IconNotification,
    roles: ['admin'],
  },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
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
          <Logo size='md' />
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
        <DisplayWithNotification key={`nav-${index}`} item={item} />
      ))}
    </>
  );
}

function DisplayWithNotification({ item }: { item: NavItem }) {
  const { data: notificationCount = 0 } = useQuery({
    queryKey: item.notificationCount?.queryKey ?? [],
    queryFn: () => item.notificationCount?.queryFn() ?? Promise.resolve(0),
    enabled: !!item.notificationCount,
    refetchInterval: item.notificationCount?.refetchInterval,
  });

  return (
    <Indicator
      position='middle-end'
      color={item.notificationCount?.color ?? 'red'}
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
  const { data: session } = useSession();

  if (item.isVisible && !item.isVisible(session)) {
    return null;
  }

  if (
    item.roles &&
    (!session?.user?.role ||
      !item.roles.includes(session.user.role as UserRole))
  ) {
    return null;
  }

  if (item.isLoading) {
    return (
      <NavLink
        label={item.label}
        leftSection={Icon ? <Icon size='1.1rem' /> : null}
        description={item.description}
        opened={true}
      >
        {[1, 2, 3].map((i) => (
          <NavLink
            key={`skeleton-${i}`}
            label={
              <Stack gap={5}>
                <Skeleton height={28} width='60%' radius='sm' animate />
                <Skeleton height={12} width='90%' radius='sm' animate />
              </Stack>
            }
          />
        ))}
      </NavLink>
    );
  }

  const navLink = (
    <NavLink
      label={item.label}
      component={item.href ? Link : undefined}
      href={item.href || ''}
      active={item.href ? pathname.startsWith(item.href) : false}
      leftSection={Icon ? <Icon size='1.1rem' /> : null}
      description={item.description}
      rightSection={
        item.href ? <IconChevronRight size='0.8rem' stroke={1.5} /> : undefined
      }
      opened={!!item.children}
    >
      {item.children?.map((child, index) => (
        <DisplayWithNotification key={`child-${index}`} item={child} />
      ))}
    </NavLink>
  );
  return navLink;
}
