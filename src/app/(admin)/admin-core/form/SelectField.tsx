import React from 'react';
import { Select } from '@mantine/core';
import { variableToLabel } from '../utils/utils';
import { SelectFieldProps } from '../types';

export default function SelectField(props: SelectFieldProps) {
  const label = props.label || variableToLabel(props.name);
  return (
    <Select
      {...props}
      label={label}
      data={props.options}
      style={{
        display: props.hidden ? 'none' : 'block',
      }}
    />
  );
}
