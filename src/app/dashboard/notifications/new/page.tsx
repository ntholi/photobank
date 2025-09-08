import { Box } from '@mantine/core';
import Form from '../Form';
import { createNotification } from '@/server/notifications/actions';

export default async function NewPage() {
  return (
    <Box p={'lg'}>
      <Form title={'Create Notification'} onSubmit={createNotification} />
    </Box>
  );
}