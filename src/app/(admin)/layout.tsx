import '@mantine/core/styles.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { APP_NAME } from '@/lib/constants';
import { SessionProvider } from 'next-auth/react';
import { Providers } from './providers';

export const metadata = {
  title: `${APP_NAME} Admin`,
  description: `Admin Panel for ${APP_NAME}`,
};

export default function MantineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
