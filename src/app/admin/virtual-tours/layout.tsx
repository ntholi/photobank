'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllLocationDetails } from '../location-details/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/virtual-tours'}
      queryKey={['virtual-tours']}
      getItems={getAllLocationDetails}
      actionIcons={[
        <NewLink key={'new-link'} href='/admin/virtual-tours/new' />,
      ]}
      renderItem={(it) => (
        <ListItem
          id={it.id}
          label={`${it.location.name} ${it.tourUrl ? '(Has Tour)' : ''}`}
        />
      )}
    >
      {children}
    </ListLayout>
  );
}
