import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import Form from '../Form';
import { createTag } from '../actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form
        onSubmit={async (value) => {
          'use server';
          const res = await createTag(value);
          revalidatePath('/admin/tags');
          return res;
        }}
      />
    </Box>
  );
}
