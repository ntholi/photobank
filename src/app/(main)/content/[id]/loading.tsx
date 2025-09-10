import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen' aria-busy='true' aria-label='Loading content'>
      <div className='w-full'>
        <div className='mx-auto max-w-7xl px-4 py-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <Card className='overflow-hidden shadow-lg'>
                <CardBody className='p-0'>
                  <Skeleton className='aspect-[4/3] w-full rounded-lg md:aspect-[16/10] lg:aspect-[3/2]' />
                </CardBody>
              </Card>
            </div>

            <div className='space-y-6 lg:col-span-1'>
              <Card className='shadow-lg'>
                <CardBody className='p-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-24 rounded-full' />
                      <Skeleton className='h-8 w-full rounded-lg' />
                      <Skeleton className='h-8 w-3/4 rounded-lg' />
                    </div>

                    <div className='space-y-3 pt-2'>
                      <Skeleton className='h-4 w-full rounded' />
                      <Skeleton className='h-4 w-full rounded' />
                      <Skeleton className='h-4 w-5/6 rounded' />
                      <Skeleton className='h-4 w-4/6 rounded' />
                    </div>

                    <div className='space-y-3 pt-4'>
                      <Skeleton className='h-5 w-32 rounded' />
                      <div className='flex flex-wrap gap-2'>
                        <Skeleton className='h-6 w-16 rounded-full' />
                        <Skeleton className='h-6 w-20 rounded-full' />
                        <Skeleton className='h-6 w-14 rounded-full' />
                        <Skeleton className='h-6 w-18 rounded-full' />
                      </div>
                    </div>

                    <div className='space-y-3 pt-4'>
                      <Skeleton className='h-5 w-24 rounded' />
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-10 w-10 rounded-full' />
                        <div className='space-y-1'>
                          <Skeleton className='h-4 w-24 rounded' />
                          <Skeleton className='h-3 w-16 rounded' />
                        </div>
                      </div>
                    </div>

                    <div className='space-y-3 pt-4'>
                      <Skeleton className='h-5 w-32 rounded' />
                      <div className='flex items-center gap-2'>
                        <Skeleton className='h-4 w-4 rounded' />
                        <Skeleton className='h-4 w-40 rounded' />
                      </div>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='h-4 w-4 rounded' />
                        <Skeleton className='h-4 w-32 rounded' />
                      </div>
                    </div>

                    <div className='flex gap-3 pt-6'>
                      <Skeleton className='h-10 w-28 rounded-lg' />
                      <Skeleton className='h-10 w-10 rounded-lg' />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
