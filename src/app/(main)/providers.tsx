'use client';

import UserContextProvider from '@/lib/context/UserContext';
import { NextUIProvider } from '@nextui-org/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </NextUIProvider>
  );
}
