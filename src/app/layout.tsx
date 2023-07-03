import { NextAuthProvider } from '@/lib/providers';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from './home/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PhotoBank',
  description: 'Lesotho photo bank',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
