import React from 'react';
import { DateTimePicker } from '@mantine/dates';
import { variableToLabel } from '../utils/utils';
import { InputProps } from '../types';
import { Timestamp } from 'firebase/firestore';

export default function DateTimeField(props: InputProps) {
  const label = props.label || variableToLabel(props.name);
  let value = props.value;
  if (props.value instanceof Timestamp) {
    value = props.value.toDate();
  }
  const newProps = { ...props, value };
  return (
    <DateTimePicker
      {...newProps}
      label={label}
      style={{
        display: props.hidden ? 'none' : 'block',
      }}
    />
  );
}
