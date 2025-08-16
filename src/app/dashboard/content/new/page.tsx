import { Box } from '@mantine/core';
import Form from '../Form';
import { createContent } from '@/server/content/actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form title={'Create Content'} onSubmit={createContent} />
    </Box>
  );
}
