'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import { Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Location, LocationDetails, Photo } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import ImagePicker from '../../components/ImagePicker';
import RichTextField from '../../components/RichTextField';
import LocationInput from './LocationInput';

type LocationDetailsFormData = LocationDetails & {
  location: Location | null;
  coverPhoto: Photo | null;
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
      coverPhoto: null,
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
          disabled={!!form.values.location}
          location={form.values.location}
          setLocation={(location) => {
            form.setFieldValue('location', location);
          }}
        />
        <ImagePicker
          photoFileName={value?.coverPhoto?.fileName}
          {...form.getInputProps('coverPhotoId')}
        />
        <RichTextField label="About" {...form.getInputProps('about')} />
      </Stack>
    </form>
  );
}
