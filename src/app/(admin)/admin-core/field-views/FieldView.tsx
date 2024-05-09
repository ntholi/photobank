import React from 'react';
import { Box, Divider, Text, TextProps } from '@mantine/core';

type Props = {
  label: string;
  value: React.ReactNode;
  valueProps?: TextProps;
};
export default function FieldView({ label, value, valueProps }: Props) {
  return (
    <Box>
      <Text size='sm' fw={500} {...valueProps}>
        {value}
      </Text>
      <Text size='sm' c='dimmed'>
        {label}
      </Text>
      <Divider />
    </Box>
  );
}
