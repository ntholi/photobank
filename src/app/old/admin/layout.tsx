import React from 'react';
import AdminShell from '../base/AdminShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
