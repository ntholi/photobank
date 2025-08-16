'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getUsers } from '@/server/users/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/dashboard/users'}
      queryKey={['users']}
      getData={getUsers}
      renderItem={(it) => (
        <ListItem id={it.id} label={it.name} description={it.email} />
      )}
    >
      {children}
    </ListLayout>
  );
}
