'use client';

import { virtualTours } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';

type VirtualTour = typeof virtualTours.$inferInsert;


type Props = {
  onSubmit: (values: VirtualTour) => Promise<VirtualTour>;
  defaultValues?: VirtualTour;
  onSuccess?: (value: VirtualTour) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
  title?: string;
};

export default function VirtualTourForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();
  
  return (
    <Form 
      title={title}
      action={onSubmit} 
      queryKey={['virtual-tours']}
      schema={createInsertSchema(virtualTours)} 
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/virtual-tours/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Url' {...form.getInputProps('url')} />
        </>
      )}
    </Form>
  );
}