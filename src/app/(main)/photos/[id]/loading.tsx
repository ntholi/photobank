import { Skeleton } from '@nextui-org/skeleton';
import React from 'react';

export default function PhotoLoading() {
  return (
    <div className="bg-gray-100">
      <section className="container mx-auto px-4 md:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 lg:col-span-3">
            <Skeleton className="rounded-lg">
              <div className="h-[70vh] rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <Skeleton className="rounded-lg">
              <div className="h-[70vh] rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </div>
      </section>
    </div>
  );
}
