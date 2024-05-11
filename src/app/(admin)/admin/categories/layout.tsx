import prisma from '@/lib/db';
import { PropsWithChildren } from 'react';
import { ResourcePage } from '../../admin-core';
import { deleteCategory } from './actions';

export default async function Layout({ children }: PropsWithChildren) {
  const data = prisma.category.findMany();
  return (
    <ResourcePage
      data={data}
      label={'Categories'}
      baseUrl="/admin/categories"
      onDelete={deleteCategory}
      navLinkProps={(it) => ({
        id: it.id,
        label: it.name,
        href: `/admin/categories/${it.id}`,
      })}
    >
      {children}
    </ResourcePage>
  );
}
