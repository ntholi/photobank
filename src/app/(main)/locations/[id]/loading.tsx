import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section Loading */}
      <div className='w-full bg-gray-100 py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Cover Image Loading */}
            <div className='lg:col-span-1'>
              <Card className='shadow-lg'>
                <CardBody className='p-0'>
                  <Skeleton className='w-full h-64 rounded-lg' />
                </CardBody>
              </Card>
            </div>

            {/* Location Details Loading */}
            <div className='lg:col-span-1 space-y-6'>
              <div className='space-y-4'>
                <Skeleton className='h-12 w-3/4 rounded-lg' />
                <Skeleton className='h-6 w-1/2 rounded-lg' />
                <div className='space-y-2 pt-4'>
                  <Skeleton className='h-4 w-full rounded' />
                  <Skeleton className='h-4 w-full rounded' />
                  <Skeleton className='h-4 w-3/4 rounded' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid Loading */}
      <div className='w-full py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='mb-8'>
            <Skeleton className='h-8 w-64 mb-2 rounded' />
            <Skeleton className='h-5 w-32 rounded' />
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className='shadow-none border border-gray-200'>
                <CardBody className='p-0'>
                  <Skeleton className='w-full aspect-square rounded-t-lg' />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
