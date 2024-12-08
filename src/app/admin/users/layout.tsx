'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllUsers } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/users'}
      queryKey={['users']}
      getItems={getAllUsers}
      actionIcons={[<NewLink key={'new-link'} href='/admin/users/new' />]}
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
