'use client';

import { tags } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';

type Tag = typeof tags.$inferInsert;

type Props = {
  onSubmit: (values: Tag) => Promise<Tag>;
  defaultValues?: Tag;
  onSuccess?: (value: Tag) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
  title?: string;
};

export default function TagForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['tags']}
      schema={createInsertSchema(tags)}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/dashboard/tags/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Name' {...form.getInputProps('name')} />
        </>
      )}
    </Form>
  );
}
