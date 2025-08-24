import { Box } from '@mantine/core';
import Form from '../Form';
import { createUser } from '@/server/users/actions';

export default async function NewPage() {
  return (
    <Box p={{ base: 'sm', md: 'lg' }}>
      <Form title={'Create User'} onSubmit={createUser} />
    </Box>
  );
}
