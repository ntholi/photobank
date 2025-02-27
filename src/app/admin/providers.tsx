'use client';
import { MantineProvider, Notification } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AppProgressBar } from 'next-nprogress-bar';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme='auto'>
      <Notifications />
      <ModalsProvider>
        <Notification />
        {children}
        <AppProgressBar
          height='3px'
          color='#2196F3'
          options={{ showSpinner: false }}
          shallowRouting
        />
      </ModalsProvider>
    </MantineProvider>
  );
}
