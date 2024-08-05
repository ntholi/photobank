'use client';
import FormHeader from '@/app/(admin)/components/FormHeader';
import {
  ActionIcon,
  Flex,
  Paper,
  Stack,
  useComputedColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Location, LocationDetails, Photo } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import ImagePicker from '../../components/ImagePicker';
import RichTextField from '../../components/RichTextField';
import LocationInput from './LocationInput';
import { IconPhoto } from '@tabler/icons-react';

type LocationDetailsFormData = LocationDetails & {
  location: Location | null;
  coverPhoto: Photo | null;
};

type Props = {
  value?: LocationDetailsFormData;
  onSubmit: (values: LocationDetailsFormData) => Promise<LocationDetails>;
};

export default function Form({ onSubmit, value }: Props) {
  const colorScheme = useComputedColorScheme('dark');

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
          disabled={!!value}
          location={form.values.location}
          setLocation={(location) => {
            form.setFieldValue('location', location);
          }}
        />
        {form.values.location ? (
          <ImagePicker
            location={form.values.location}
            photoFileName={value?.coverPhoto?.fileName}
            {...form.getInputProps('coverPhotoId')}
          />
        ) : (
          <Paper
            withBorder
            h={265}
            w="100%"
            bg={colorScheme == 'dark' ? 'dark.7' : 'gray.1'}
          ></Paper>
        )}
        <RichTextField label="About" {...form.getInputProps('about')} />
      </Stack>
    </form>
  );
}
