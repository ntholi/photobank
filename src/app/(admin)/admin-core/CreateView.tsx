import { Box, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import React, { PropsWithChildren } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';
import SubmitButton from './form/SubmitButton';
import { Repository, Resource, ResourceCreate } from './repository/repository';
import { useQueryState } from 'nuqs';

export type CreateViewProps<T extends Resource> = {
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  repository: Repository<T>;
  initialValues?: ResourceCreate<T>;
  afterSubmit?: (value: T) => Promise<void>;
};

export default function CreateView<T extends Resource>(
  props: PropsWithChildren<CreateViewProps<T>>,
) {
  const { children, schema, repository, initialValues } = props;
  const form = useForm<ResourceCreate<T>>({
    validate: schema && zodResolver(schema),
    initialValues,
  });
  const [_, setView] = useQueryState('view');
  const [__, setId] = useQueryState('id');

  const handleSubmit = async (values: ResourceCreate<T>) => {
    if (repository) {
      const res = await repository.create(values);
      await props.afterSubmit?.(res);
      await setView(null);
      await setId(res.id);
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
            repository,
          });
        })}
      </Stack>
      <SubmitButton>Create</SubmitButton>
    </form>
  );
}
