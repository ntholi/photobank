import { Skeleton, Stack } from '@mantine/core';
import React from 'react';

export default function Loading() {
  return (
    <Stack py={50} px={70} pb={120} gap={'lg'}>
      <Skeleton mt="sm" h={50} w="100%" />
      <Skeleton h={160} w="100%" />
      <Skeleton h={160} w="100%" />
    </Stack>
  );
}
