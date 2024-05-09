import { Stack } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

export default function DetailsView({ children }: PropsWithChildren) {
  return (
    <Stack py={50} px={70} pb={120} gap={'lg'}>
      {children}
    </Stack>
  );
}
