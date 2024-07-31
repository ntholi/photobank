import { Box } from '@mantine/core';
import Form from './Form';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export default async function NewPage() {
  const session = await auth();
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
