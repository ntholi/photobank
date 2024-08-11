import { Box } from '@mantine/core';
import { revalidatePath } from 'next/cache';
import Form from '../Form';
import { createUpdate } from '../actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form
        onSubmit={async (value) => {
          'use server';
          const res = await createUpdate(value);
          revalidatePath('/admin/updates');
          return res;
        }}
      />
    </Box>
  );
}
