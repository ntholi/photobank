import React, { PropsWithChildren } from 'react';
import AdminShell from '../AdminShell';

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminShell>{children}</AdminShell>;
}
