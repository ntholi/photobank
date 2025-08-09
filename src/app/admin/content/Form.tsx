'use client';

import { content } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';

type Content = typeof content.$inferInsert;

type Props = {
  onSubmit: (values: Content) => Promise<Content>;
  defaultValues?: Content;
  onSuccess?: (value: Content) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
  title?: string;
};

export default function ContentForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['content']}
      schema={createInsertSchema(content)}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/content/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Type' {...form.getInputProps('type')} />
          <TextInput label='File Name' {...form.getInputProps('fileName')} />
          <TextInput label='Location' {...form.getInputProps('location')} />
          <TextInput label='Status' {...form.getInputProps('status')} />
        </>
      )}
    </Form>
  );
}
