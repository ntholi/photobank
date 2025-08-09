import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import Dashboard from './dashboard';
import Providers from './providers';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Dashboard>{children}</Dashboard>
    </Providers>
  );
}
