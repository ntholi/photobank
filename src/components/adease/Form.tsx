'use client';

import { ZodObject, ZodTypeAny } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Stack, StackProps } from '@mantine/core';
import React from 'react';
import FormHeader from './FormHeader';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ZodSchema = ZodObject<Record<string, ZodTypeAny>>;

export type FormProps<T extends Record<string, unknown>> = {
  children: React.ReactNode;
  action: (values: T) => Promise<T>;
  schema?: ZodSchema;
  defaultValues?: T;
  title?: string;
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
  queryKey: string[];
} & StackProps;

export function Form<T extends Record<string, unknown>>({
  schema,
  defaultValues,
  action,
  title,
  children,
  onSuccess,
  onError,
  queryKey,
  ...props
}: FormProps<T>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<T>({
    validate: schema && zodResolver(schema),
    initialValues: defaultValues,
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
      <FormHeader
        title={title}
        isLoading={mutation.isPending}
        onClose={() => {
          router.back();
        }}
      />
      <Stack p='xl' {...props}>
        {React.Children.map(children, (child) => addFormProps(child, form))}
      </Stack>
    </form>
  );
}

function addFormProps<T extends Record<string, unknown>>(
  child: React.ReactNode,
  form: ReturnType<typeof useForm<T>>
): React.ReactNode {
  if (!React.isValidElement(child)) return child;

  const props = { ...child.props };

  if (props.name) {
    Object.assign(props, form.getInputProps(props.name));
  }

  if (props.children) {
    props.children = React.Children.map(props.children, (grandChild) =>
      addFormProps(grandChild, form)
    );
  }

  return React.cloneElement(child, props);
}
