'use client';

import { virtualTours } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import LocationPicker from '@/app/components/LocationPicker';
import { upsertLocationByPlaceId } from '@/server/locations/actions';

type VirtualTour = typeof virtualTours.$inferInsert;

type Props = {
  onSubmit: (values: VirtualTour) => Promise<VirtualTour>;
  defaultValues?: VirtualTour;
  onSuccess?: (value: VirtualTour) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function VirtualTourForm({
  onSubmit,
  defaultValues,
  title,
}: Props) {
  const router = useRouter();
  const schema = createInsertSchema(virtualTours).extend({
    url: z.string().url(),
  });

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['virtual-tours']}
      schema={schema}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/dashboard/virtual-tours/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Name' required {...form.getInputProps('name')} />
          <input type='hidden' {...form.getInputProps('locationId')} />
          <LocationPicker
            label='Location'
            required
            onLocationSelect={async ({
              placeId,
              name,
              address,
              latitude,
              longitude,
            }) => {
              const loc = await upsertLocationByPlaceId({
                placeId,
                name,
                address: address ?? null,
                latitude,
                longitude,
              });
              form.setFieldValue('locationId', loc.id);
            }}
          />
          <TextInput
            type='url'
            label='URL'
            placeholder='https://…'
            {...form.getInputProps('url')}
          />
        </>
      )}
    </Form>
  );
}
