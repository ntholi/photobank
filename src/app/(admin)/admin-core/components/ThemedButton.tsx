import { Button, ButtonProps, useComputedColorScheme } from '@mantine/core';
import React from 'react';

type Props = {
  type?: 'submit' | 'reset' | 'button';
} & ButtonProps;

export default function ThemedButton({ children, ...props }: Props) {
  const colorScheme = useComputedColorScheme();
  return (
    <Button
      color='dark'
      variant={colorScheme === 'dark' ? 'default' : 'filled'}
      {...props}
    >
      {children}
    </Button>
  );
}
