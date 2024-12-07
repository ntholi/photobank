import prisma from '@/lib/prisma';
import { PropsWithChildren } from 'react';
import ListPage from '../../components/ListPage';
import { Image } from '@mantine/core';
import { thumbnail } from '@/lib/config/urls';

export default async function Layout({ children }: PropsWithChildren) {
  const list = await prisma.photo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <ListPage
      path="admin/photos"
      nav={list.map((item) => ({
        label: item.id,
        href: `/admin/photos/${item.id}`,
        leftSection: (
          <Image w={50} h={50} radius={'md'} src={thumbnail(item.fileName)} />
        ),
      }))}
    >
      {children}
    </ListPage>
  );
}
