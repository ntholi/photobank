'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllPhotos } from './actions';
import { shorten } from '@/utils';
import { thumbnail } from '@/lib/config/urls';
import { Image } from '@mantine/core';

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
          label={shorten(it.description) || it.fileName}
          leftSection={
            <Image
              src={thumbnail(it.fileName)}
              alt={it.fileName}
              w={40}
              h={40}
              radius='sm'
            />
          }
        />
      )}
    >
      {children}
    </ListLayout>
  );
}
