'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import { Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { Location } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type Props = {
  value?: Location;
  onSubmit: (values: Location) => Promise<Location>;
};

export default function Form({ onSubmit, value }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { setValues, ...form } = useForm<Location>({
    initialValues: value,
    validate: {
      name: isNotEmpty('Name is required'),
    },
  });

  async function handleSubmit(values: Location) {
    startTransition(async () => {
      const { id } = await onSubmit(Object.assign(values));
      router.push(`/admin/locations/${id}`);
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormHeader title="Locations" isLoading={pending} />
      <Stack p={'xl'}>
        <TextInput
          label="Location"
          placeholder="Name"
          {...form.getInputProps('name')}
        />
      </Stack>
    </form>
  );
}
