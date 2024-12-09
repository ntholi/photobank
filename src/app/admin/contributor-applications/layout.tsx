'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllContributorApplications } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/contributor_applications'}
      queryKey={['contributor_applications']}
      getItems={getAllContributorApplications}
      actionIcons={[<NewLink key={'new-link'} href='/admin/contributor_applications/new' />]}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}