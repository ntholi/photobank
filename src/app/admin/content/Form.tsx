'use client';

import { content } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import LocationPicker from '@/app/components/LocationPicker';
import { useState } from 'react';
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
  initialLocationName?: string;
};

export default function ContentForm({
  onSubmit,
  defaultValues,
  title,
  initialLocationName,
}: Props) {
  const router = useRouter();
  const [locationName, setLocationName] = useState<string>(
    initialLocationName ?? ''
  );

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
          <input type='hidden' {...form.getInputProps('locationId')} />
          <LocationPicker
            label='Location'
            placeholder='Search locations'
            value={locationName}
            onChange={(v) => setLocationName(v)}
            onLocationSelect={(selected) => {
              form.setFieldValue('locationId', selected.id);
              setLocationName(selected.name);
            }}
          />
          <TextInput label='Status' {...form.getInputProps('status')} />
        </>
      )}
    </Form>
  );
}
