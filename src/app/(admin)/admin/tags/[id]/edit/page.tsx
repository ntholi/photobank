import prisma from '@/lib/prisma';
import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import Form from '../../Form';
import { getTag } from '../../actions';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function EditPage({ params: { id } }: Props) {
  const item = await getTag(Number(id));
  if (!item) return notFound();

  return (
    <Box p={'lg'}>
      <Form
        value={item}
        onSubmit={async (value) => {
          'use server';
          const { labels, ...data } = value;
          const res = await prisma.tag.create({
            data: {
              ...data,
              labels: {
                create: labels,
              },
            },
          });
          revalidatePath('/admin/tags');
          return res;
        }}
      />
    </Box>
  );
}
