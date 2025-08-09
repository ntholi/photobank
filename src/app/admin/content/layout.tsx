'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getContents } from '@/server/content/actions';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/contents'}
      queryKey={['contents']}
      getData={getContents}
      actionIcons={[<NewLink key={'new-link'} href='/admin/contents/new' />]}
      renderItem={(it) => <ListItem id={it.id} label={it.id} />}
    >
      {children}
    </ListLayout>
  );
}
