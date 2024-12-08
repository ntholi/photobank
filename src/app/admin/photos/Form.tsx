'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import LocationInput from '@/app/old/admin/locations/LocationInput';
import { useState } from 'react';
import { Location } from '@prisma/client';
import { sanitize } from '@/utils';
import UserInput from '@/components/UserInput';

type Photo = Omit<Prisma.PhotoUpdateInput, 'location'> & {
  location?:
    | Location
    | null
    | { connect: { id: string } }
    | { disconnect: true };
};

type Props = {
  onSubmit: (values: Photo) => Promise<Photo>;
  defaultValues?: Prisma.PhotoGetPayload<{
    include: {
      location: true;
    };
  }>;
  onSuccess?: (value: Photo) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function PhotoForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(
    (defaultValues?.location as Location) || null,
  );

  return (
    <Form
      title={title}
      action={(values) =>
        onSubmit({
          ...values,
          location: location
            ? { connect: { id: location.id } }
            : { disconnect: true },
        })
      }
      queryKey={['photos']}
      defaultValues={sanitize(defaultValues)}
      onSuccess={({ id }) => {
        router.push(`/admin/photos/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='File Name' {...form.getInputProps('fileName')} />
          <TextInput label='Status' {...form.getInputProps('status')} />
          <TextInput
            label='Description'
            {...form.getInputProps('description')}
          />
          <LocationInput location={location} setLocation={setLocation} />
          <UserInput label='User' {...form.getInputProps('userId')} />
        </>
      )}
    </Form>
  );
}
