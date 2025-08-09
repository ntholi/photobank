import '@/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import { Providers } from './providers';
import { Jost } from 'next/font/google';

const font = Jost({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lehakoe',
  description: "Lehakoe, Lesotho's photo bank",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
      <div className={font.className}>{children}</div>
    </Providers>
  );
}
