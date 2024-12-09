import './globals.css';
import { Jost } from 'next/font/google';
import { Providers } from './providers';
import Navbar from './base/Navbar';
import { APP_NAME } from '@/lib/constants';
import Footer from './home/Footer';
import SplashScreen from '@/components/SplashScreen';

const font = Jost({ subsets: ['latin'] });

export const metadata = {
  title: APP_NAME,
  description: "Lehakoe, Lesotho's photo bank",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <Providers>
      <div className={font.className}>
        <Navbar />
        <div className='min-h-dvh'>
          <SplashScreen>{children}</SplashScreen>
        </div>
        <Footer className='mt-10' />
      </div>
    </Providers>
  );
}
