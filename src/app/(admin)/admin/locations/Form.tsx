'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import { Stack } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { Location } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import LocationInput from './LocationInput';

type Props = {
  value?: Location;
  onSubmit: (values: Location) => Promise<Location>;
};

export default function Form({ onSubmit, value }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<Location>({
    initialValues: value || { id: '', name: '', latitude: 0, longitude: 0 },
    validate: {
      name: isNotEmpty('Name is required'),
    },
  });

  async function handleSubmit(values: Location) {
    startTransition(async () => {
      const { id } = await onSubmit(values);
      router.push(`/admin/locations/${id}`);
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormHeader title="Locations" isLoading={pending} />
      <Stack p={'xl'}>
        <LocationInput
          location={form.values}
          setLocation={(newLocation) => {
            if (newLocation) {
              form.setValues({ ...newLocation });
            }
          }}
        />
      </Stack>
    </form>
  );
}
