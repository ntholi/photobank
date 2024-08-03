import {
  ActionIcon,
  AppShell,
  Avatar,
  Divider,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconChevronRight,
  IconFileDescription,
  IconHome,
  IconLogout2,
  IconNote,
  IconPhoto,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  return (
    <AppShell.Navbar p="xs">
      <AppShell.Section grow component={ScrollArea}>
        <NavLink
          label="Landing Page"
          component={Link}
          active={pathname.startsWith('/admin/landing-page')}
          href={'/admin/landing-page'}
          leftSection={<IconHome size="1.1rem" />}
          rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
        />
        <NavLink
          label="Photos"
          component={Link}
          active={pathname.startsWith('/admin/photos')}
          href={'/admin/photos'}
          leftSection={<IconPhoto size="1.1rem" />}
          rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
        />
        <NavLink
          label="Tags"
          component={Link}
          active={pathname.startsWith('/admin/tags')}
          href={'/admin/tags'}
          leftSection={<IconFileDescription size="1.1rem" />}
          rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
        />
        <NavLink label="Users" leftSection={<IconUsers size={'1rem'} />} opened>
          <NavLink
            label="Users"
            component={Link}
            active={pathname.startsWith('/admin/users')}
            href={'/admin/users'}
            leftSection={<IconUser size="1.1rem" />}
            rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
          />
          <NavLink
            label="Applications"
            component={Link}
            active={pathname.startsWith('/admin/contributor-applications')}
            href={'/admin/contributor-applications'}
            leftSection={<IconNote size="1.1rem" />}
            rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
          />
        </NavLink>
      </AppShell.Section>
      <AppShell.Section>
        <Divider />
        <UserButton />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

function UserButton() {
  const { data: session } = useSession();

  const openModal = () =>
    modals.openConfirmModal({
      centered: true,
      title: 'Confirm logout',
      children: 'Are you sure you want to logout?',
      confirmProps: { color: 'dark' },
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      onConfirm: () => signOut(),
    });

  return (
    <Flex mt={'md'} mb={'sm'} justify="space-between" align={'center'}>
      <Group>
        <Avatar src={session?.user?.image} />
        <Stack gap={5}>
          <Text size="0.9rem">{session?.user?.name}</Text>
          <Text size="0.7rem" c={'dimmed'}>
            {session?.user?.email}
          </Text>
        </Stack>
      </Group>
      <ActionIcon variant="default" size={'lg'}>
        <IconLogout2 size="1rem" onClick={openModal} />
      </ActionIcon>
    </Flex>
  );
}
