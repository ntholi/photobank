'use client';
import React from 'react';
import Image from 'next/image';
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

type Props = {
  children?: React.ReactNode;
};
export default function Splash({ children }: Props) {
  const { data: session } = useSession();
  const logoHeight = 60;

  // return session?.user?.id ? (
  //   <div className="w-dvw h-dvh flex justify-center items-center">
  //     <Image
  //       src={`/images/logo/transparent.png`}
  //       width={logoHeight * 3.22}
  //       height={logoHeight}
  //       alt="logo"
  //     />
  //   </div>
  // ) : (
  return children;
  // );
}
