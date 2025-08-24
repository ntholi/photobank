import { Box } from '@mantine/core';
import Form from '../Form';
import { createTag } from '@/server/tags/actions';

export default async function NewPage() {
  return (
    <Box p={{ base: 'sm', md: 'lg' }}>
      <Form title={'Create Tag'} onSubmit={createTag} />
    </Box>
  );
}
