'use client';
import {
  MantineColorSchemeManager,
  MantineProvider,
  createTheme,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React, { Suspense } from 'react';
import { ModalsProvider } from '@mantine/modals';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    breakpoints: {
      xl: '1538px',
    },
  });

  return (
    <Suspense>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <Notifications />
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </Suspense>
  );
}
