import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';

import { Jost } from 'next/font/google';
import { Providers } from './providers';

const font = Jost({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
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
