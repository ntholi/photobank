'use client';

import { userRoleEnum, users } from '@/db/schema';
import { Form } from '@/components/adease';
import { Select, TextInput } from '@mantine/core';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'nextjs-toploader/app';

type User = typeof users.$inferInsert;

type Props = {
  onSubmit: (values: User) => Promise<User>;
  defaultValues?: User;
  onSuccess?: (value: User) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function UserForm({ onSubmit, defaultValues, title }: Props) {
  const router = useRouter();

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['users']}
      schema={createInsertSchema(users)}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/dashboard/users/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='Name' {...form.getInputProps('name')} />
          <Select
            label='Role'
            {...form.getInputProps('role')}
            data={userRoleEnum.enumValues.map((role) => ({
              value: role,
              label: role,
            }))}
          />
        </>
      )}
    </Form>
  );
}
