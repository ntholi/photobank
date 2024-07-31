import React from 'react';
import { Box, Divider, Text, TextProps } from '@mantine/core';
import { dateTime } from '@/lib/format';

type Props = {
  label: string;
  value: any;
  valueProps?: TextProps;
};

export default function FieldView({ label, value, valueProps }: Props) {
  return (
    <Box>
      <Text size='sm' fw={500} {...valueProps}>
        {formatValue(value)}
      </Text>
      <Text size='sm' c='dimmed'>
        {label}
      </Text>
      <Divider />
    </Box>
  );
}

function formatValue(value: any) {
  if (!value) return '(None)';

  if (value instanceof Date) {
    return dateTime(value);
  }
  return value;
}
