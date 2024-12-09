'use client';

import { ZodObject, ZodTypeAny } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Stack, StackProps } from '@mantine/core';
import React, { JSX } from 'react';
import FormHeader from './FormHeader';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ZodSchema = ZodObject<Record<string, ZodTypeAny>>;

export type FormProps<T extends Record<string, unknown>, V> = Omit<
  StackProps,
  'children'
> & {
  children: (form: ReturnType<typeof useForm<T>>) => JSX.Element;
  action: (values: T) => Promise<T>;
  schema?: ZodSchema;
  defaultValues?: V;
  title?: string;
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
  queryKey: string[];
  showHeader?: boolean;
  closable?: boolean;
};

export function Form<T extends Record<string, unknown>, V>({
  schema,
  defaultValues,
  action,
  title,
  children,
  onSuccess,
  onError,
  queryKey,
  showHeader = true,
  closable = true,
  ...props
}: FormProps<T, V>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<T>({
    validate: schema && zodResolver(schema),
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {showHeader && (
        <FormHeader
          title={title}
          isLoading={mutation.isPending}
          onClose={() => {
            router.back();
          }}
          closable={closable}
        />
      )}
      <Stack p='xl' {...props}>
        {children(form)}
      </Stack>
    </form>
  );
}
