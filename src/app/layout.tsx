import { NextAuthProvider } from '@/lib/providers';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PhotoBank',
  description: 'Lesotho photo bank',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}