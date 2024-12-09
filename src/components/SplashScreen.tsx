'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const { status } = useSession();
  if (status === 'loading') {
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
