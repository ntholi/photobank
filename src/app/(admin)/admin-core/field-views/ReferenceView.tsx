import React from 'react';
import { Anchor, Box, Divider, Text } from '@mantine/core';
import Link from 'next/link';

type Props = {
  label: string;
  value: React.ReactNode;
  reference: string;
  referenceKey?: string;
};
export default function ReferenceView(props: Props) {
  const { label, value, reference, referenceKey } = props;
  return (
    <Box>
      <Anchor
        component={Link}
        href={`/admin/${reference}?id=${referenceKey}`}
        size='sm'
        fw={500}
      >
        {value}
      </Anchor>
      <Text size='sm' c='dimmed'>
        {label}
      </Text>
      <Divider />
    </Box>
  );
}
