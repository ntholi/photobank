import { EditView } from '@/app/(admin)/admin-core';
import prisma from '@/lib/db';
import { TextInput } from '@mantine/core';
import { notFound } from 'next/navigation';
import React from 'react';
import { updateCategory } from '../../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function EditCategory({ params: { id } }: Props) {
  const data = await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!data) {
    return notFound();
  }

  return (
    <EditView onSubmit={updateCategory} resource={data}>
      <TextInput label="Name" placeholder="Category name" name="name" />
    </EditView>
  );
}
