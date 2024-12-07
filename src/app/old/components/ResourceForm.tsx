'use client';
import { Button, Group, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';

type Resource = {};
type ResourceCreate<T extends Resource> = Partial<T>;

export type Props<T extends Resource> = {
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  initialValues?: ResourceCreate<T>;
  onCreate?: (value: T) => Promise<void>;
  onUpdate?: (value: T, id: any) => Promise<void>;
  objectId?: string | number;
};

export default function ResourceForm<T extends Resource>(
  props: PropsWithChildren<Props<T>>
) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const { children, schema, initialValues } = props;

  const form = useForm<ResourceCreate<T>>({
    validate: schema && zodResolver(schema),
    initialValues,
  });

  const handleSubmit = async (values: ResourceCreate<T>) => {
    startTransition(async () => {
      if (props.onCreate) {
        await props.onCreate(values as T);
      }
      if (props.onUpdate && props.objectId) {
        await props.onUpdate(values as T, props.objectId);
      }
      router.refresh();
      form.reset();
      close();
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={'lg'}>
        {React.Children.map(children, (child: React.ReactNode) => {
          if (!React.isValidElement(child)) return child;
          if (!child.props.name) return child;
          return React.cloneElement(child as React.ReactElement, {
            ...child.props,
            ...form.getInputProps(child.props.name),
          });
        })}
      </Stack>
      <Group align='flex-end' mt={'xl'} w={'100%'}>
        <Button type='submit' loading={isPending} w={'100%'}>
          Save
        </Button>
      </Group>
    </form>
  );
}
