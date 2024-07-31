import prisma from '@/lib/prisma';
import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import Form from './Form';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form
        onSubmit={async (value) => {
          'use server';
          const { labels, ...data } = value;
          const res = await prisma.tag.create({
            data: {
              ...data,
              labels: {
                create: labels,
              },
              // userId: session!.user!.id,
            },
          });
          revalidatePath('/admin/tags');
          return res;
        }}
      />
    </Box>
  );
}
