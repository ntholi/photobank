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
  const data = await prisma.photo.findUnique({
    where: { id },
  });

  if (!data) {
    return notFound();
  }

  return (
    <DetailsView>
      <FieldView label="Caption" value={data.caption} />
    </DetailsView>
  );
}
