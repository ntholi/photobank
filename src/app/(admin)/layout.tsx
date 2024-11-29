import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Lehakoe Admin',
  description: 'Admin panel for Lehakoe Photobank',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
