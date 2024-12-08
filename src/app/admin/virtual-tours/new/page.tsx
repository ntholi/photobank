import { Box } from '@mantine/core';
import { saveVirtualTour } from '../actions';
import Form from '../Form';

export default function NewPage() {
  const handleSubmit = async (values: {
    locationDetailsId: string;
    tourUrl: string;
  }) => {
    'use server';
    await saveVirtualTour(values.locationDetailsId, values.tourUrl);
  };

  return (
    <Box p={'lg'}>
      <Form title={'Add Virtual Tour'} onSubmit={handleSubmit} />
    </Box>
  );
}
