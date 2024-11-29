'use client';
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar } from 'next-nprogress-bar';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    breakpoints: {
      xl: '1538px',
    },
  });

  const colorSchemeManager = localStorageColorSchemeManager({
    key: 'lehakoe-photobank-color-scheme',
  });

  return (
    <>
      <ColorSchemeScript
        nonce='Qj3s8hRLFbRry5ETX79vvwiAvZJjHdTqYGwF+OUINGo='
        defaultColorScheme='auto'
      />
      <MantineProvider
        theme={theme}
        defaultColorScheme='auto'
        colorSchemeManager={colorSchemeManager}
      >
        <Notifications />
        <ModalsProvider>
          <SessionProvider>
            {children}
            <AppProgressBar
              height='3px'
              color='#2196F3'
              options={{ showSpinner: false }}
              shallowRouting
            />
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
