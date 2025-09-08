'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getNotifications } from '@/server/notifications/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/dashboard/notifications'}
      queryKey={['notifications']}
      getData={getNotifications}
      actionIcons={[
        <NewLink key={'new-link'} href='/dashboard/notifications/new' />,
      ]}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}
