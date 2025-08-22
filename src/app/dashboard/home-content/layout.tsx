import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Home Content',
  description: 'Home Content',
};

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return <>{children}</>;
}
