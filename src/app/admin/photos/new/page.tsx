import { Box } from '@mantine/core';
import Form from '../Form';
import { createPhoto } from '../actions';
import { Prisma } from '@prisma/client';

type Photo = Prisma.PhotoCreateInput;

export default async function NewPage() {
  const handleSubmit = async (values: Photo): Promise<Photo> => {
    'use server';
    await createPhoto(values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form onSubmit={handleSubmit} />
    </Box>
  );
}
