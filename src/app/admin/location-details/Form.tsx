'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import {
  Paper,
  Stack,
  Tabs,
  TextInput,
  useComputedColorScheme,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/ImagePicker';
import RichTextField from '@/app/old/components/RichTextField';

type LocationDetail = Prisma.LocationDetailsCreateInput;

type Props = {
  onSubmit: (values: LocationDetail) => Promise<LocationDetail>;
  defaultValues?: Prisma.LocationDetailsGetPayload<{
    include: {
      coverPhoto: true;
      location: true;
    };
  }>;
  onSuccess?: (value: LocationDetail) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function LocationDetailForm({
  onSubmit,
  defaultValues,
  title,
}: Props) {
  const router = useRouter();
  const colorScheme = useComputedColorScheme('dark');

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['location-details']}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/location-details/${id}`);
      }}
      p={'xs'}
    >
      {(form) => (
        <Tabs defaultValue='details'>
          <Tabs.List>
            <Tabs.Tab value='details'>Details</Tabs.Tab>
            <Tabs.Tab value='tour'>Virtual Tour</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='details' p={'sm'}>
            <Stack>
              <TextInput label='Location' {...form.getInputProps('location')} />
              {form.values.location ? (
                <ImagePicker
                  location={form.values.location}
                  photoFileName={defaultValues?.coverPhoto?.fileName}
                  {...form.getInputProps('coverPhotoId')}
                />
              ) : (
                <Paper
                  withBorder
                  h={265}
                  w='100%'
                  bg={colorScheme == 'dark' ? 'dark.7' : 'gray.1'}
                ></Paper>
              )}
              <RichTextField label='About' {...form.getInputProps('about')} />
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value='tour' p={'sm'}>
            <TextInput label='Tour Url' {...form.getInputProps('tourUrl')} />
          </Tabs.Panel>
        </Tabs>
      )}
    </Form>
  );
}
