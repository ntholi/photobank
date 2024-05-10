import prisma from '@/lib/db';
import { PropsWithChildren } from 'react';
import { ResourcePage } from '../../admin-core';

export default async function Layout({ children }: PropsWithChildren) {
  const data = prisma.category.findMany();
  return (
    <ResourcePage
      data={data}
      navLinkProps={(it) => ({
        label: it.name,
        href: `/admin/categories/${it.id}`,
      })}
    >
      {children}
    </ResourcePage>
  );
}
