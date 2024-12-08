import { LocationDetailsCreate } from '@/repositories/location-details/repository';
import { Box } from '@mantine/core';
import Form from '../Form';
import { createLocationDetail } from '../actions';

export default async function NewPage() {
  const handleSubmit = async (values: LocationDetailsCreate) => {
    'use server';
    return await createLocationDetail(values);
  };

  return (
    <Box p={'lg'}>
      <Form title={'Create Location'} onSubmit={handleSubmit as any} />
    </Box>
  );
}
