import { Box } from '@mantine/core';
import Form from '../Form';
import { createLocation } from '@/server/locations/actions';

export default async function NewPage() {
  return (
    <Box p={{ base: 'sm', md: 'lg' }}>
      <Form title={'Create Location'} onSubmit={createLocation} />
    </Box>
  );
}
