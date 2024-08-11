'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Update } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { z } from 'zod';

type Props = {
  value?: Update;
  onSubmit: (values: Update) => Promise<Update>;
};

const schema = z.object({});

export default function Form({ onSubmit, value }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { setValues, ...form } = useForm<Update>({
    initialValues: value,
    validate: zodResolver(schema),
  });

  async function handleSubmit(value: Update) {
    startTransition(async () => {
      const { id } = await onSubmit(value);
      router.push(`/admin/updates/${id}`);
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormHeader title="Updates" isLoading={pending} />
      <Stack p={'xl'}>
        <TextInput
          label="Update"
          placeholder="Name"
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Description"
          description="Detailed description of the Update (optional)"
          rows={5}
          {...form.getInputProps('description')}
        />
      </Stack>
    </form>
  );
}
