'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const logoHeight = 60;
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col justify-center items-center capitalize">
      <Image
        src={`/images/logo/black.png`}
        width={logoHeight * 3.22}
        height={logoHeight}
        alt="logo"
      />
      <h2 className="font-extralight">Something went wrong!</h2>
      <Button
        className="mt-3"
        color="primary"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
