import { Text } from '@mantine/core';

const FieldDisplay = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: any;
  children?: any;
}) => (
  <div className="">
    <Text c="dimmed" fw="bold" fs="sm">
      {label}
    </Text>
    {value ? <Text fs="sm">{value}</Text> : children}
  </div>
);

export default FieldDisplay;
