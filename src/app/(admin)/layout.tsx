import '../globals.css';
import '@mantine/core/styles.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { APP_NAME } from '@/lib/constants';

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
        <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
      </body>
    </html>
  );
}
