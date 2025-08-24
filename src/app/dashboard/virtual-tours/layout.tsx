'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getVirtualTours } from '@/server/virtual-tours/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/dashboard/virtual-tours'}
      queryKey={['virtual-tours']}
      getData={getVirtualTours}
      actionIcons={[<NewLink key={'new-link'} href='/admin/virtual-tours/new' />]}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}