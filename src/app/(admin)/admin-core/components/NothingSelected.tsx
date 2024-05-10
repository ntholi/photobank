import { Stack, Title, Text } from '@mantine/core';
import React from 'react';

type Props = {
  title: string;
};
export default function NothingSelected({ title }: Props) {
  return (
    <Stack align="center" gap={5} justify="center" mt="30vh">
      <div>
        <Title fw={400} c="gray">
          {title}
        </Title>
        <Text pl={3} c="gray" size="xs">
          Nothing Selected
        </Text>
      </div>
    </Stack>
  );
}
