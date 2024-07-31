import '../globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from './base/Navbar';
import { APP_NAME } from '@/lib/constants';
import Footer from './home/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: APP_NAME,
  description: 'Lesotho photo bank',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="min-h-dvh">{children}</div>
          <Footer className="mt-10" />
        </Providers>
      </body>
    </html>
  );
}
