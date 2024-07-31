import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { ColorSchemeScript } from '@mantine/core';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Registry Admin',
  description:
    'Limkokwing University of Creative Technology Registry System, Lesotho',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
