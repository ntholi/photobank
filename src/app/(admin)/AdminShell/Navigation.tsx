import { AppShell, Avatar, Divider, NavLink, ScrollArea } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconCategory,
  IconChevronRight,
  IconHome,
  IconLogout2,
  IconNews,
  IconPhoto,
  IconUser,
  IconUserEdit,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  return (
    <AppShell.Navbar p="xs">
      <AppShell.Section grow component={ScrollArea}>
        <NavLink
          label="Users"
          component={Link}
          active={pathname.startsWith('/admin/users')}
          href={'/admin/users'}
          leftSection={<IconUser size="1.1rem" />}
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
      </AppShell.Section>
      <AppShell.Section>
        <Divider mb="md" />
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
    <NavLink
      label="Logout"
      description={session?.user?.name}
      onClick={openModal}
      leftSection={<Avatar src={session?.user?.image} />}
      rightSection={<IconLogout2 size="1.1rem" />}
    />
  );
}
