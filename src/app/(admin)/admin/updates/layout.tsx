import prisma from '@/lib/prisma';
import { PropsWithChildren } from 'react';
import ListPage from '../../components/ListPage';

export default async function Layout({ children }: PropsWithChildren) {
  const list = await prisma.update.findMany();
  return (
    <ListPage
      path="admin/updates"
      nav={list.map((item) => ({
        label: item.name,
        href: `/admin/updates/${item.id}`,
      }))}
    >
      {children}
    </ListPage>
  );
}
