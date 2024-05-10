import { DetailsView, FieldView } from '@/app/(admin)/admin-core';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};
export default async function CategoryPage({ params: { id } }: Props) {
  const data = await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!data) {
    return notFound();
  }

  return (
    <DetailsView>
      <FieldView label="Name" value={data.name} />
    </DetailsView>
  );
}
