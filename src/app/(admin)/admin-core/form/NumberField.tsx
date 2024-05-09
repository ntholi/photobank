import React from 'react';
import { NumberInput } from '@mantine/core';
import { variableToLabel } from '../utils/utils';
import { InputProps } from '../types';

export default function NumberField(props: InputProps) {
  const label = props.label || variableToLabel(props.name);
  return (
    <NumberInput
      {...props}
      label={label}
      style={{
        display: props.hidden ? 'none' : 'block',
      }}
    />
  );
}
