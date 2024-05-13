import prisma from '@/lib/db';
import { PropsWithChildren } from 'react';
import { ResourcePage } from '../../admin-core';

export default async function Layout({ children }: PropsWithChildren) {
  const data = prisma.user.findMany();
  return (
    <ResourcePage
      data={data}
      label={'Users'}
      baseUrl="/admin/users"
      navLinkProps={(it) => ({
        id: it.id,
        label: it.name,
        href: `/admin/users/${it.id}`,
      })}
    >
      {children}
    </ResourcePage>
  );
}
