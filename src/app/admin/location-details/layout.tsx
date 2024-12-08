'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllLocationDetails } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/locationDetails'}
      queryKey={['locationDetails']}
      getItems={getAllLocationDetails}
      actionIcons={[
        <NewLink key={'new-link'} href='/admin/locationDetails/new' />,
      ]}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}
