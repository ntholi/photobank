import { Box } from '@mantine/core';
import Form from '../Form';
import { createContent } from '@/server/content/actions';

export default async function NewPage() {
  return (
    <Box p={{ base: 'sm', md: 'lg' }}>
      <Form title={'Create Content'} onSubmit={createContent} />
    </Box>
  );
}
