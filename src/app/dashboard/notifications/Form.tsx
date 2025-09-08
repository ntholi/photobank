'use client';

import { notifications } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';

type Notification = typeof notifications.$inferInsert;

type Props = {
  onSubmit: (values: Notification) => Promise<Notification>;
  defaultValues?: Notification;
  onSuccess?: (value: Notification) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function NotificationForm({
  onSubmit,
  defaultValues,
  title,
}: Props) {
  const router = useRouter();

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['notifications']}
      schema={createInsertSchema(notifications)}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/dashboard/notifications/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Recipient' {...form.getInputProps('recipient')} />
          <TextInput label='Type' {...form.getInputProps('type')} />
          <TextInput label='Status' {...form.getInputProps('status')} />
          <TextInput label='Title' {...form.getInputProps('title')} />
          <TextInput label='Body' {...form.getInputProps('body')} />
        </>
      )}
    </Form>
  );
}
