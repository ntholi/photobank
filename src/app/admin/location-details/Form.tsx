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
import RichTextField from '@/app/old/components/RichTextField';
import LocationInput from '@/components/LocationInput';
import { LocationDetailsCreate } from '@/repositories/location-details/repository';
import { sanitize } from '@/utils';

type Props = {
  onSubmit: (values: LocationDetailsCreate) => Promise<LocationDetailsCreate>;
  defaultValues?: Prisma.LocationDetailsGetPayload<{
    include: {
      coverPhoto: true;
      location: true;
    };
  }>;
  onSuccess?: (value: LocationDetailsCreate) => void;
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
      defaultValues={sanitize(defaultValues)}
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
              <LocationInput {...form.getInputProps('location')} />
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
