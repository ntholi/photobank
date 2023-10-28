'use client';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <SessionProvider>{children}</SessionProvider>
    </MantineProvider>
  );
}
