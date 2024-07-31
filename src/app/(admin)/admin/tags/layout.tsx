import prisma from '@/lib/prisma';
import { PropsWithChildren } from 'react';
import ListPage from '../../components/ListPage';

export default async function Layout({ children }: PropsWithChildren) {
  const list = await prisma.tag.findMany();
  return (
    <ListPage
      path="admin/tags"
      nav={list.map((item) => ({
        label: item.name,
        href: `/admin/tags/${item.id}`,
      }))}
    >
      {children}
    </ListPage>
  );
}
