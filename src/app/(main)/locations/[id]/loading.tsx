import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen' aria-busy='true'>
      <div className='bg-content1 w-full py-12'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div className='lg:col-span-1'>
              <Card className='shadow-lg'>
                <CardBody className='p-0'>
                  <div className='min-w-0'>
                    <Skeleton className='h-[50vh] w-full rounded-md sm:h-[60vh]' />
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className='space-y-6 lg:col-span-1'>
              <div className='space-y-4'>
                <Skeleton className='h-12 w-3/4 rounded-lg' />
                <Skeleton className='h-6 w-1/2 rounded-lg' />
                <div className='space-y-2 pt-4'>
                  <Skeleton className='h-4 w-full rounded' />
                  <Skeleton className='h-4 w-full rounded' />
                  <Skeleton className='h-4 w-3/4 rounded' />
                </div>
                <div className='flex gap-3 pt-4'>
                  <Skeleton className='h-10 w-24 rounded-md' />
                  <Skeleton className='h-10 w-24 rounded-md' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full py-12'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-8'>
            <Skeleton className='mb-2 h-8 w-64 rounded' />
            <Skeleton className='h-5 w-32 rounded' />
          </div>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className='border-default-200 border shadow-none'>
                <CardBody className='p-0'>
                  <Skeleton className='aspect-square w-full rounded-t-md' />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
