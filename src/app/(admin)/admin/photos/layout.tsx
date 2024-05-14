import prisma from '@/lib/db';
import { PropsWithChildren } from 'react';
import { ResourcePage } from '../../admin-core';
import { deleteCategory } from './actions';
import { Image } from '@mantine/core';
import { thumbnail } from '@/lib/config/urls';

export default async function Layout({ children }: PropsWithChildren) {
  const data = prisma.photo.findMany();
  return (
    <ResourcePage
      data={data}
      label={'Photos'}
      baseUrl="/admin/photos"
      onDelete={deleteCategory}
      navLinkProps={(it) => ({
        id: it.id,
        leftSection: (
          <Image
            h={40}
            w={40}
            radius={'sm'}
            src={thumbnail(it.fileName)}
            alt={it.caption || ''}
          />
        ),
        label: it.caption,
        href: `/admin/photos/${it.id}`,
      })}
    >
      {children}
    </ResourcePage>
  );
}
