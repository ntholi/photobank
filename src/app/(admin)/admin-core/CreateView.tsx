'use client';
import { Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import React, { PropsWithChildren } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';
import SubmitButton from './form/SubmitButton';
import { Resource, ResourceCreate } from './repository/repository';

export type CreateViewProps<T extends Resource> = {
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  initialValues?: ResourceCreate<T>;
  onCreate?: (value: any) => Promise<void>;
};

export default function CreateView<T extends Resource>(
  props: PropsWithChildren<CreateViewProps<T>>,
) {
  const { children, schema, onCreate, initialValues } = props;
  const form = useForm<ResourceCreate<T>>({
    validate: schema && zodResolver(schema),
    initialValues,
  });

  const handleSubmit = async (values: ResourceCreate<T>) => {
    if (onCreate) {
      await onCreate(values as T);
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
