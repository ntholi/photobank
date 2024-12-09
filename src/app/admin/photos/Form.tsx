'use client';

import { Form } from '@/components/adease';
import LocationInput from '@/components/LocationInput'; // Update import
import { sanitize } from '@/utils';
import { TextInput } from '@mantine/core';
import { Location, Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      action={async (values: Photo) => {
        const updateData: Photo = {
          id: values.id,
          status: values.status,
          description: values.description,
        };

        if (location !== (defaultValues?.location as Location)) {
          if (location && location.id) {
            try {
              const locationExists = await fetch(
                `/api/locations/${location.id}`,
              );
              if (locationExists.ok) {
                updateData.location = { connect: { id: location.id } };
              }
            } catch (error) {
              console.error('Failed to verify location:', error);
            }
          } else {
            updateData.location = { disconnect: true };
          }
        }

        return onSubmit(updateData);
      }}
      queryKey={['photos']}
      defaultValues={sanitize(defaultValues)}
      onSuccess={({ id }) => {
        router.push(`/admin/photos/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Status' {...form.getInputProps('status')} />
          <TextInput
            label='Description'
            {...form.getInputProps('description')}
          />
          <LocationInput {...form.getInputProps('location')} />
        </>
      )}
    </Form>
  );
}
