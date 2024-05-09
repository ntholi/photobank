import { Textarea } from '@mantine/core';
import { InputProps } from '../types';
import { variableToLabel } from '../utils/utils';

type Props = {
  rows?: number;
} & InputProps;

export default function TextField(props: Props) {
  const label = props.label || variableToLabel(props.name);
  return (
    <Textarea
      {...props}
      label={label}
      style={{
        display: props.hidden ? 'none' : 'block',
      }}
    />
  );
}
