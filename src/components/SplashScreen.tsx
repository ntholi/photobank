'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
