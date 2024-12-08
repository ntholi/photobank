'use client';

import { ListItem, ListLayout } from '@/components/adease';
import { PropsWithChildren } from 'react';
import { getAllUsers } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/users'}
      queryKey={['users']}
      getItems={getAllUsers}
      renderItem={(it) => (
        <ListItem
          id={it.id}
          label={it.name || 'No Name'}
          description={it.email}
        />
      )}
    >
      {children}
    </ListLayout>
  );
}
