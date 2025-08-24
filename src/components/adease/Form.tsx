'use client';

import { Stack, StackProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'nextjs-toploader/app';
import { JSX } from 'react';
import { z } from 'zod';
import FormHeader from './FormHeader';

export type FormProps<T extends Record<string, unknown>, V> = Omit<
  StackProps,
  'children'
> & {
  children: (form: ReturnType<typeof useForm<T>>) => JSX.Element;
  beforeSubmit?: (form: ReturnType<typeof useForm<T>>) => void;
  action: (values: T) => Promise<T>;
  schema?: z.ZodSchema<T>;
  defaultValues?: V;
  title?: string;
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
  queryKey: string[];
};

export function Form<T extends Record<string, unknown>, V>({
  schema,
  beforeSubmit,
  defaultValues,
  action,
  title,
  children,
  onSuccess,
  onError,
  queryKey,
  ...props
}: FormProps<T, V>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<T>({
    mode: 'uncontrolled',
    validate: schema ? zodResolver(schema) : undefined,
    initialValues: defaultValues as T,
  });

  const mutation = useMutation({
    mutationFn: action,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey,
        refetchType: 'all',
      });
      onSuccess?.(data);
      notifications.show({
        title: 'Success',
        message: 'Record saved successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: error.message || 'An unexpected error occurred',
        color: 'red',
      });
      onError?.(error);
    },
  });

  async function handleSubmit(values: T) {
    mutation.mutate(values);
  }

  return (
    <form
      onSubmit={(e) => {
        beforeSubmit?.(form);
        form.onSubmit(handleSubmit)(e);
      }}
    >
      <FormHeader
        title={title}
        isLoading={mutation.isPending}
        onClose={() => {
          router.back();
        }}
      />
      <Stack p={{ base: 'md', md: 'xl' }} {...props}>
        {children(form)}
      </Stack>
    </form>
  );
}
