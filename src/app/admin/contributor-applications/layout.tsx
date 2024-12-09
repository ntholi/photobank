'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllContributorApplications } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/contributor-applications'}
      queryKey={['contributor-applications']}
      getItems={getAllContributorApplications}
      actionIcons={[
        <NewLink key={'new-link'} href='/admin/contributor-applications/new' />,
      ]}
      renderItem={(it) => (
        <ListItem id={it.id} label={it.user.name || it.user.id} />
      )}
    >
      {children}
    </ListLayout>
  );
}
