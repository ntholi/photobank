'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const { status } = useSession();
  const [shouldShow, setShouldShow] = React.useState(true);

  React.useEffect(() => {
    const hasShown = localStorage.getItem('splashscreen_shown');
    if (hasShown) {
      setShouldShow(false);
    } else {
      localStorage.setItem('splashscreen_shown', 'true');
    }
  }, []);

  if (status === 'loading' && shouldShow) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
        <div className='flex animate-pulse items-center justify-center'>
          <Image
            src='/images/logo/black.png'
            alt='Photobank Logo'
            width={200}
            height={200}
            className='mx-auto object-contain'
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
