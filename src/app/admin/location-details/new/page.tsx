import { Box } from '@mantine/core';
import Form from '../Form';
import { createLocationDetail } from '../actions';
import { Prisma } from '@prisma/client';

type LocationDetail = Prisma.LocationDetailsCreateInput;

export default async function NewPage() {
  const handleSubmit = async (values: LocationDetail) => {
    'use server';
    await createLocationDetail(values);
    return values;
  };

  return (
    <Box p={'lg'}>
      <Form title={'Create Location'} onSubmit={handleSubmit} />
    </Box>
  );
}
