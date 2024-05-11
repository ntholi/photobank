'use client';
import { Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';
import SubmitButton from './form/SubmitButton';

interface WithId {
  id: string | number;
}

export type EditViewProps<T extends WithId> = {
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  resource: T;
  onSubmit?: (id: any, value: any) => Promise<any>;
  afterSubmit?: (value: T) => Promise<void>;
};

export default function EditView<T extends WithId>(
  props: PropsWithChildren<EditViewProps<T>>,
) {
  const { children, schema, onSubmit, afterSubmit, resource } = props;
  const router = useRouter();
  const form = useForm<T>({
    initialValues: {
      ...resource,
    },
    validate: schema && zodResolver(schema),
  });

  const handleSubmit = async (values: T) => {
    if (onSubmit && resource) {
      if (!resource.id) throw new Error('WithId does not have an id');
      const res = await onSubmit(resource.id, values);
      if (afterSubmit) {
        await afterSubmit(res);
      } else {
        router.back();
      }
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
        <SubmitButton>Update</SubmitButton>
      </Stack>
    </form>
  );
}
