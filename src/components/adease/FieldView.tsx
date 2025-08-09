import { Box, BoxProps, Divider, Text } from '@mantine/core';
import React from 'react';

export interface FieldViewProps extends BoxProps {
  label: string;
  underline?: boolean;
  children?: React.ReactNode;
}

export function FieldView({
  label,
  underline = true,
  children,
  ...props
}: FieldViewProps) {
  const isText = typeof children === 'string' || typeof children === 'number';
  return (
    <Box {...props}>
      {children ? (
        <>
          {React.isValidElement(children) ? (
            children
          ) : isText ? (
            <Text size='sm' fw={500}>
              {children}
            </Text>
          ) : (
            children
          )}
        </>
      ) : (
        <Text size='sm' fs={'italic'}>
          Empty
        </Text>
      )}
      <Text size='sm' c='dimmed'>
        {label}
      </Text>
      {underline && <Divider />}
    </Box>
  );
}
