'use client';

import { Prisma } from '@prisma/client';
import { Form } from '@/components/adease';
import { TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { ContributorApplication as Application } from '@prisma/client';

type Props = {
  onSubmit: (values: Application) => Promise<Application>;
  defaultValues?: Prisma.ContributorApplicationGetPayload<{}>;
  onSuccess?: (value: Application) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
  ) => void;
  title?: string;
};

export default function ContributorApplicationForm({
  onSubmit,
  defaultValues,
  title,
}: Props) {
  const router = useRouter();

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['contributor-applications']}
      defaultValues={defaultValues}
      onSuccess={({ id }) => {
        router.push(`/admin/contributor-applications/${id}`);
      }}
    >
      {(form) => (
        <>
          <TextInput label='User' {...form.getInputProps('user')} />
          <TextInput label='Status' {...form.getInputProps('status')} />
          <TextInput label='Message' {...form.getInputProps('message')} />
        </>
      )}
    </Form>
  );
}
