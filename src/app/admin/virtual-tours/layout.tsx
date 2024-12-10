'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getLocationsWithTour } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/virtual-tours'}
      queryKey={['location-details']}
      getItems={getLocationsWithTour}
      actionIcons={[
        <NewLink key={'new-link'} href='/admin/virtual-tours/new' />,
      ]}
      renderItem={(it) => <ListItem id={it.id} label={it.location.name} />}
    >
      {children}
    </ListLayout>
  );
}
