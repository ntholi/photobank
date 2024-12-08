'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';

type Photo = Prisma.PhotoCreateInput;

type Props = {
  onSubmit: (values: Photo) => Promise<Photo>;
  defaultValues?: Prisma.PhotoGetPayload<{}>;
  onSuccess?: (value: Photo) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
};

export default function PhotoForm({ onSubmit, defaultValues }: Props) {
  const router = useRouter();
  
  return (
    <Form 
      action={onSubmit} 
      queryKey={['photos']}

      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/photos/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='File Name' {...form.getInputProps('fileName')} />
          <TextInput label='Status' {...form.getInputProps('status')} />
          <TextInput label='Description' {...form.getInputProps('description')} />
          <TextInput label='Location' {...form.getInputProps('location')} />
          <TextInput label='User' {...form.getInputProps('user')} />
        </>
      )}
    </Form>
  );
}
