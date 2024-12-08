'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import { TextInput, Checkbox } from '@mantine/core';
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
      queryKey={['users']}
      defaultValues={sanitize(defaultValues)}
      onSuccess={({ id }) => {
        router.push(`/admin/users/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Name' {...form.getInputProps('name')} />
          <TextInput label='Email' {...form.getInputProps('email')} />
          <TextInput label='Role' {...form.getInputProps('role')} />
          <Checkbox label='Blocked' {...form.getInputProps('blocked')} />
          <TextInput label='Website' {...form.getInputProps('website')} />
          <TextInput label='Bio' {...form.getInputProps('bio')} />
        </>
      )}
    </Form>
  );
}
