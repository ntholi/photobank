import { Divider, Group, Paper } from '@mantine/core';
import React from 'react';
import ThemedButton from '../components/ThemedButton';

type Props = {
  children: React.ReactNode;
};

export default function SubmitButton({ children }: Props) {
  return (
    <>
      <Paper
        radius={0}
        bottom={0}
        left={0}
        right={0}
        pos='absolute'
        style={{ zIndex: 100 }}
      >
        <Divider />
        <Group justify='flex-end' p='md'>
          <ThemedButton type='submit' w={{ base: '100%', md: 300 }} h={40}>
            {children}
          </ThemedButton>
        </Group>
      </Paper>
    </>
  );
}
