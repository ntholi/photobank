import { Box, BoxProps, Divider, Text } from '@mantine/core';
import React from 'react';

export interface FieldViewProps extends BoxProps {
  label: string;
  children?: React.ReactNode;
}

export function FieldView({ label, children, ...props }: FieldViewProps) {
  return (
    <Box {...props}>
      {children ? (
        <>
          {React.isValidElement(children) ? (
            children
          ) : (
            <Text size='sm' fw={500}>
              {children}
            </Text>
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
      <Divider />
    </Box>
  );
}
