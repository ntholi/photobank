import prisma from '@/lib/prisma';
import { PropsWithChildren } from 'react';
import ListPage from '../../components/ListPage';

export default async function Layout({ children }: PropsWithChildren) {
  const list = await prisma.locationDetails.findMany({
    include: {
      location: true,
    },
  });
  return (
    <ListPage
      path="admin/locations"
      nav={list.map((item) => ({
        label: item.location.name,
        href: `/admin/locations/${item.id}`,
      }))}
    >
      {children}
    </ListPage>
  );
}
