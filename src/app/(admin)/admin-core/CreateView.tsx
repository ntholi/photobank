'use client';
import { Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';
import SubmitButton from './form/SubmitButton';
import { ResourceCreate } from './repository/repository';

export type CreateViewProps<T> = {
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  initialValues?: ResourceCreate<T>;
  onSubmit?: (value: any) => Promise<any>;
  afterSubmit?: (value: T) => Promise<void>;
};

export default function CreateView<T>(
  props: PropsWithChildren<CreateViewProps<T>>,
) {
  const { children, schema, onSubmit, afterSubmit, initialValues } = props;
  const router = useRouter();
  const form = useForm<ResourceCreate<T>>({
    validate: schema && zodResolver(schema),
    initialValues,
  });

  const handleSubmit = async (values: ResourceCreate<T>) => {
    if (onSubmit) {
      await onSubmit(values as T);
    }
    if (afterSubmit) {
      await afterSubmit(values as T);
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack py={50} px={70} pb={120} gap={'lg'}>
        {React.Children.map(children, (child: React.ReactNode) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement, {
            ...child.props,
            ...form.getInputProps(child.props.name),
          });
        })}
      </Stack>
      <SubmitButton>Create</SubmitButton>
    </form>
  );
}
