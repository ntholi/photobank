'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllLocationDetails } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/location-details'}
      queryKey={['location-details']}
      getItems={getAllLocationDetails}
      actionIcons={[
        <NewLink key={'new-link'} href='/admin/location-details/new' />,
      ]}
      renderItem={(it) => <ListItem id={it.id} label={it.location.name} />}
    >
      {children}
    </ListLayout>
  );
}
