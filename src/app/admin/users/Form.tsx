'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import {
  TextInput,
  Checkbox,
  Grid,
  Fieldset,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { sanitize } from '@/utils';

type User = Prisma.UserCreateInput;

type Props = {
  onSubmit: (values: User) => Promise<User>;
  defaultValues?: Prisma.UserGetPayload<{}>;
  onSuccess?: (value: User) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
};

export default function UserForm({ onSubmit, defaultValues }: Props) {
  const router = useRouter();

  return (
    <Form
      action={onSubmit}
      title='User'
      queryKey={['users']}
      defaultValues={sanitize(defaultValues!)}
      onSuccess={({ id }) => {
        router.push(`/admin/users/${id}`);
      }}
      p={'xs'}
    >
      {(form) => (
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Fieldset legend='User'>
              <Stack gap={'xs'}>
                <TextInput label='Name' {...form.getInputProps('name')} />
                <TextInput label='Email' {...form.getInputProps('email')} />
                <TextInput label='Website' {...form.getInputProps('website')} />
                <TextInput label='Bio' {...form.getInputProps('bio')} />
              </Stack>
            </Fieldset>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Fieldset legend='Settings'>
              <Stack gap={'xs'}>
                <SegmentedControl
                  color='blue'
                  data={[
                    { label: 'Active', value: 'false' },
                    { label: 'Blocked', value: 'true' },
                  ]}
                  {...form.getInputProps('blocked')}
                />
                <SegmentedControl
                  color='blue'
                  data={[
                    { label: 'User', value: 'user' },
                    { label: 'Contributor', value: 'contributor' },
                    { label: 'Moderator', value: 'moderator' },
                    { label: 'Admin', value: 'admin' },
                  ]}
                  {...form.getInputProps('role')}
                />
              </Stack>
            </Fieldset>
          </Grid.Col>
        </Grid>
      )}
    </Form>
  );
}
