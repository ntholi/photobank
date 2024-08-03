import { Stack, Title, Paper, Flex, Button } from '@mantine/core';
import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import AddButton from './AddButton';

export default function HomePage() {
  return (
    <Stack>
      <Paper p="lg" withBorder>
        <Flex justify={'space-between'} align={'center'}>
          <Title fw={'lighter'} size={18} c="gray">
            Home Page Photos
          </Title>
          <AddButton />
        </Flex>
      </Paper>
      <Paper p="lg" withBorder>
        xxx
      </Paper>
    </Stack>
  );
}
