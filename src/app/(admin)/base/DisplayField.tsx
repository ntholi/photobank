import { Text } from '@mantine/core';
import { type } from 'os';

type Props = {
  label: string;
  value?: any;
  children?: any;
};

export default function DisplayField({ label, value, children }: Props) {
  return (
    <div className="">
      <Text c="dimmed" fw="bold" fs="sm">
        {label}
      </Text>
      {value ? <Text fs="sm">{value}</Text> : children}
    </div>
  );
}
