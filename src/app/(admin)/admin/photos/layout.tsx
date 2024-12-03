'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllPhotos } from './actions';
import { Image } from '@mantine/core';
import { thumbnail } from '@/lib/config/urls';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/photos'}
      queryKey={['photos']}
      getItems={getAllPhotos}
      actionIcons={[<NewLink key={'new-link'} href='/admin/photos/new' />]}
      renderItem={(it) => (
        <ListItem
          id={it.id}
          label={it.id}
          leftSection={
            <Image w={40} h={40} radius={'md'} src={thumbnail(it.fileName)} />
          }
        />
      )}
    >
      {children}
    </ListLayout>
  );
}
