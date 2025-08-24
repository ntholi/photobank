import { Box } from '@mantine/core';
import Form from '../Form';
import { createVirtualTour } from '@/server/virtual-tours/actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form title={'Create Virtual Tour'} onSubmit={createVirtualTour} />
    </Box>
  );
}