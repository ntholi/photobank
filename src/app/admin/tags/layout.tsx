'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllTags } from './actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/tags'}
      queryKey={['tags']}
      getItems={getAllTags}
      actionIcons={[<NewLink key={'new-link'} href='/admin/tags/new' />]}
      renderItem={(it) => <ListItem id={it.id} label={it.name} />}
    >
      {children}
    </ListLayout>
  );
}
