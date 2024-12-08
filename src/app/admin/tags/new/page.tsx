import { Box } from '@mantine/core';
import { Tag } from '@prisma/client';
import Form from '../Form';
import { createTag } from '../actions';

export default async function NewPage() {
  const handleSubmit = async (values: Tag): Promise<Tag> => {
    'use server';
    await createTag(values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form title={'Create Tag'} onSubmit={handleSubmit} />
    </Box>
  );
}
