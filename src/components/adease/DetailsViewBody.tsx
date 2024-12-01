import React from 'react';
import { Stack, type StackProps } from '@mantine/core';

export interface DetailsViewBodyProps extends StackProps {
  children: React.ReactNode;
}
export function DetailsViewBody({ children, ...props }: DetailsViewBodyProps) {
  return (
    <Stack p='xl' {...props}>
      {children}
    </Stack>
  );
}
