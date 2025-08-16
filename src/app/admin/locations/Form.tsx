'use client';

import { locations } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';

type Location = typeof locations.$inferInsert;


type Props = {
  onSubmit: (values: Location) => Promise<Location>;
  defaultValues?: Location;
  onSuccess?: (value: Location) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
  title?: string;
};

export default function LocationForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();
  
  return (
    <Form 
      title={title}
      action={onSubmit} 
      queryKey={['locations']}
      schema={createInsertSchema(locations)} 
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/locations/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Place Id' {...form.getInputProps('placeId')} />
          <TextInput label='Name' {...form.getInputProps('name')} />
          <TextInput label='Location' {...form.getInputProps('location')} />
        </>
      )}
    </Form>
  );
}