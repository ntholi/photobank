'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getLocations } from '@/server/locations/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/dashboard/locations'}
      queryKey={['locations']}
      getData={getLocations}
      actionIcons={[
        <NewLink key={'new-link'} href='/dashboard/locations/new' />,
      ]}
      renderItem={(it) => <ListItem id={it.id} label={it.name} />}
    >
      {children}
    </ListLayout>
  );
}
