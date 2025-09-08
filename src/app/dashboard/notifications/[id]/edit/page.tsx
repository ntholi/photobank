import { Box } from '@mantine/core';
import { notFound } from 'next/navigation';
import Form from '../../Form';
import { getNotification, updateNotification } from '@/server/notifications/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotificationEdit({ params }: Props) {
  const { id } = await params;
  const notification = await getNotification(id);
  if (!notification) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <Form
        title={'Edit Notification'}
        defaultValues={notification}
        onSubmit={async (value) => {
          'use server';
          return await updateNotification(id, value);
        }}
      />
    </Box>
  );
}