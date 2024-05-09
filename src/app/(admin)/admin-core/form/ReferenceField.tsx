'use client';
import React, { useEffect } from 'react';
import { CloseButton, Select } from '@mantine/core';
import { variableToLabel } from '../utils/utils';
import { Resource } from '../repository/repository';
import { ReferenceInputProps } from '../types';

type Data = {
  id?: string;
  [key: string]: any;
};

export default function ReferenceField<T extends Resource>({
  referenceLabel,
  ...props
}: ReferenceInputProps<T>) {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState<Data[]>([]);

  useEffect(() => {
    if (props.repository) {
      props.repository
        .getResourceList(props.reference)
        .then((data) => {
          setData(data);
        })
        .catch(console.error);
      if (props.value) {
        setValue(props.value?.id || '');
      }
    }
  }, [props.reference, props.repository, props.value, referenceLabel]);

  const label = props.label || variableToLabel(props.name);
  return (
    <Select
      {...props}
      searchable
      clearable
      label={label}
      value={value}
      onChange={(_, options) => {
        if (props.onChange) {
          const value = options
            ? { id: options.value, [referenceLabel]: options.label }
            : null;
          props.onChange(value);
        }
        setValue(options?.value);
      }}
      data={data.map((it) => {
        if (!it.id) {
          throw new Error('Resource does not have an id');
        }
        return {
          value: it.id,
          label: it[referenceLabel],
        };
      })}
    />
  );
}
