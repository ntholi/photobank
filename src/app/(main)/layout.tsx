import '../globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from './base/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PhotoBank',
  description: 'Lesotho photo bank',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
