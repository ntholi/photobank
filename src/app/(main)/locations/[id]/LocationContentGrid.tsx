'use client';

import React from 'react';
import { content as contentSchema } from '@/db/schema';
import { getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';

type Content = typeof contentSchema.$inferSelect;

interface LocationContentGridProps {
  content: Content[];
  locationName: string;
}

export function LocationContentGrid({
  content,
  locationName,
}: LocationContentGridProps) {
  const router = useRouter();

  const handleContentClick = (contentId: string) => {
    router.push(`/content/${contentId}`);
  };

  if (content.length === 0) {
    return (
      <div className='w-full py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <div className='text-6xl mb-6'>📷</div>
          <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
            No photos available
          </h3>
          <p className='text-gray-600 text-lg'>
            There are currently no published photos from {locationName}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full py-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Photos from {locationName}
          </h2>
          <p className='text-gray-600'>
            {content.length} photo{content.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {content.map((item) => (
            <Card
              key={item.id}
              className='group cursor-pointer shadow-none border border-gray-200 hover:shadow-sm transition-all duration-300 hover:scale-[1.02]'
              onClick={() => handleContentClick(item.id)}
            >
              <CardBody className='p-0'>
                <div className='aspect-square overflow-hidden rounded-t-lg relative'>
                  <img
                    src={getImageUrl(item.thumbnailKey)}
                    alt={
                      item.description ||
                      `${item.type} content from ${locationName}`
                    }
                    className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80'
                    loading='lazy'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/photo_session.svg';
                    }}
                  />

                  {/* Video indicator */}
                  {item.type === 'video' && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-8 h-8 bg-black/60 rounded-full flex items-center justify-center'>
                        <svg
                          className='w-4 h-4 text-white ml-0.5'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content description */}
                {item.description && (
                  <div className='p-3'>
                    <p className='text-sm text-gray-700 line-clamp-2 group-hover:text-gray-900 transition-colors'>
                      {item.description}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Show more button if we have many photos */}
        {content.length >= 20 && (
          <div className='mt-8 text-center'>
            <Button
              variant='bordered'
              className='px-8 py-2'
              onClick={() => {
                // TODO: Implement pagination or "load more" functionality
                console.log('Load more photos...');
              }}
            >
              Load More Photos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
