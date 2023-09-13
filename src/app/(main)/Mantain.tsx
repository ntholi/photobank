import React from 'react';
import { Image } from '@nextui-org/image';

export default function Maintain() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center max-w-lg">
        <div className="mb-4 flex flex-col justify-center items-center">
          <Image src="/images/logo.jpg" alt="Logo" className="my-4 w-36" />
          <h1 className="text-5xl font-extrabold text-blue-600">503</h1>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-center text-gray-700">
          Temporarily down for maintenance We’ll be back soon!
        </h3>
        <p className="text-sm text-center text-gray-600">
          Sorry for the inconvenience but we’re performing some maintenance at
          the moment. If you need to you can always{' '}
          <a className="text-blue-600 hover:underline">Contact us </a>,
          otherwise we’ll be back online shortly!
        </p>
      </div>
    </div>
  );
}
