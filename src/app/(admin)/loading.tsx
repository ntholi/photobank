import React from 'react';
import { Loader } from '@mantine/core';

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader />
    </div>
  );
}
