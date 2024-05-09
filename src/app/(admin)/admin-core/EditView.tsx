import { Box, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import React, { PropsWithChildren } from 'react';
import { ZodObject, ZodTypeAny } from 'zod';
import SubmitButton from './form/SubmitButton';
import { Repository, Resource } from './repository/repository';
import { useQueryState } from 'nuqs';

export type EditViewProps<T extends Resource> = {
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  repository: Repository<T>;
  resource: T;
  afterSubmit?: (value: T) => Promise<void>;
};

export default function EditView<T extends Resource>(
  props: PropsWithChildren<EditViewProps<T>>,
) {
  const { children, schema, repository, resource } = props;
  const form = useForm<T>({
    initialValues: {
      ...resource,
    },
    validate: schema && zodResolver(schema),
  });
  const [_, setView] = useQueryState('view');

  const handleSubmit = async (values: T) => {
    if (repository && resource) {
      if (!resource.id) throw new Error('Resource does not have an id');
      const res = await repository.update(resource.id, values);
      await props.afterSubmit?.(res);
      await setView(null);
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
        <SubmitButton>Update</SubmitButton>
      </Stack>
    </form>
  );
}
