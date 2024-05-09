import { auth } from '@/lib/config/firebase';
import { AppShell, Avatar, Divider, NavLink, ScrollArea } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconCategory,
  IconChevronRight,
  IconHome,
  IconLogout2,
  IconNews,
  IconUserEdit,
} from '@tabler/icons-react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from '../auth/SessionProvider';

export default function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <AppShell.Navbar p='xs'>
      <AppShell.Section grow component={ScrollArea}>
        <NavLink
          label='Home Page'
          component={Link}
          active={pathname.startsWith('/admin/home-page')}
          href={'/admin/home-page'}
          leftSection={<IconHome size='1.1rem' />}
          rightSection={<IconChevronRight size='0.8rem' stroke={1.5} />}
        />
        <NavLink
          label='Posts'
          component={Link}
          active={pathname.startsWith('/admin/posts')}
          href={'/admin/posts'}
          leftSection={<IconNews size='1.1rem' />}
          rightSection={<IconChevronRight size='0.8rem' stroke={1.5} />}
        />
        <NavLink
          label='Categories'
          component={Link}
          active={pathname.startsWith('/admin/categories')}
          href={'/admin/categories'}
          leftSection={<IconCategory size='1.1rem' />}
          rightSection={<IconChevronRight size='0.8rem' stroke={1.5} />}
        />
        <NavLink
          label='Authors'
          component={Link}
          active={pathname.startsWith('/admin/authors')}
          href={'/admin/authors'}
          leftSection={<IconUserEdit size='1.1rem' />}
          rightSection={<IconChevronRight size='0.8rem' stroke={1.5} />}
        />
      </AppShell.Section>
      <AppShell.Section>
        <Divider mb='md' />
        <UserButton />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

function UserButton() {
  const { user } = useSession();

  const openModal = () =>
    modals.openConfirmModal({
      centered: true,
      title: 'Confirm logout',
      children: 'Are you sure you want to logout?',
      confirmProps: { color: 'dark' },
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      onConfirm: () => signOut(auth),
    });

  return (
    <NavLink
      label='Logout'
      description={user?.displayName}
      onClick={openModal}
      leftSection={<Avatar src={user?.photoURL} />}
      rightSection={<IconLogout2 size='1.1rem' />}
    />
  );
}
