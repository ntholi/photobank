import { TextInput } from '@mantine/core';
import { InputProps } from '../types';
import { variableToLabel } from '../utils/utils';

export default function TextField(props: InputProps) {
  const label = props.label || variableToLabel(props.name);
  return (
    <TextInput
      {...props}
      label={label}
      style={{
        display: props.hidden ? 'none' : 'block',
      }}
    />
  );
}
