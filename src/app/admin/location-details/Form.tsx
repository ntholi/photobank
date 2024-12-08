'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import { Tabs, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';

type LocationDetail = Prisma.LocationDetailsCreateInput;

type Props = {
  onSubmit: (values: LocationDetail) => Promise<LocationDetail>;
  defaultValues?: Prisma.LocationDetailsGetPayload<{}>;
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

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['location-details']}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/location-details/${id}`);
      }}
    >
      {(form) => (
        <Tabs defaultValue='details'>
          <Tabs.List>
            <Tabs.Tab value='details'>Details</Tabs.Tab>
            <Tabs.Tab value='tour'>Virtual Tour</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='details'>
            <TextInput label='Location' {...form.getInputProps('location')} />
            <TextInput
              label='Cover Photo'
              {...form.getInputProps('coverPhoto')}
            />
            <TextInput label='About' {...form.getInputProps('about')} />
          </Tabs.Panel>
          <Tabs.Panel value='tour'>
            <TextInput label='Tour Url' {...form.getInputProps('tourUrl')} />
          </Tabs.Panel>
        </Tabs>
      )}
    </Form>
  );
}
