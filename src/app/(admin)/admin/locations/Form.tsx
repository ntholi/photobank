'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import { Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Location, LocationDetails } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import LocationInput from './LocationInput';
import { RichTextEditor } from '@mantine/tiptap';
import RichTextField from '../../components/RichTextField';

type LocationDetailsFormData = LocationDetails & {
  location: Location | null;
};

type Props = {
  value?: LocationDetailsFormData;
  onSubmit: (values: LocationDetailsFormData) => Promise<LocationDetails>;
};

export default function Form({ onSubmit, value }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<LocationDetailsFormData>({
    initialValues: value || {
      id: '',
      locationId: '',
      coverPhotoId: null,
      about: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      location: null,
    },
  });

  async function handleSubmit(values: LocationDetailsFormData) {
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
          location={form.values.location}
          setLocation={(location) => {
            form.setFieldValue('location', location);
          }}
        />
        <RichTextField label="About" {...form.getInputProps('about')} />
      </Stack>
    </form>
  );
}
