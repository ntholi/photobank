'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getUsers } from '@/server/users/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/users'}
      queryKey={['users']}
      getData={getUsers}
      actionIcons={[<NewLink key={'new-link'} href='/admin/users/new' />]}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}