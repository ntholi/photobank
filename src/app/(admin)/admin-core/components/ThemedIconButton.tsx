import {
  ActionIcon,
  ActionIconProps,
  useComputedColorScheme,
} from '@mantine/core';
import React, { HTMLAttributes } from 'react';

type Props = ActionIconProps & HTMLAttributes<HTMLButtonElement>;

export default function ThemedIconButton({ children, ...props }: Props) {
  const colorScheme = useComputedColorScheme();
  return (
    <ActionIcon
      color='dark'
      variant={colorScheme === 'dark' ? 'default' : 'filled'}
      {...props}
    >
      {children}
    </ActionIcon>
  );
}
