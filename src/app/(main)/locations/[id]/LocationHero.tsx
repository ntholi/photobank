import React from 'react';
import { locations, content as contentSchema } from '@/db/schema';
import { getImageUrl } from '@/lib/utils';
import { Image } from '@heroui/image';
import { Card, CardBody } from '@heroui/card';
import {
  extractDominantColors,
  generateGradient,
  getDefaultColors,
} from '@/lib/colors';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

interface LocationHeroProps {
  location: Location & {
    coverContent: Content | null;
    about: string | null;
  };
}

export async function LocationHero({ location }: LocationHeroProps) {
  const hasCoverContent = location.coverContent !== null;

  async function getDominantColors(): Promise<string[]> {
    try {
      if (!hasCoverContent || !location.coverContent?.thumbnailKey) {
        return getDefaultColors();
      }

      const url = getImageUrl(location.coverContent.thumbnailKey);
      const colors = await extractDominantColors(url);
      return colors;
    } catch (error) {
      console.warn('Color extraction failed, using defaults:', error);
      return getDefaultColors();
    }
  }

  const dominantColors = await getDominantColors();

  return (
    <div
      className='w-full relative overflow-hidden'
      style={{
        background: generateGradient(dominantColors, 0.2),
      }}
    >
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='lg:col-span-1'>
            {hasCoverContent && location.coverContent ? (
              <div className='rounded-xl p-0.5 shadow-lg'>
                <Image
                  src={getImageUrl(location.coverContent.watermarkedKey)}
                  alt={`${location.name} - Cover photo`}
                  className='w-full h-auto max-h-[60vh] object-contain'
                  loading='eager'
                  radius='lg'
                  width={800}
                  height={600}
                />
              </div>
            ) : (
              <Card className='h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300'>
                <CardBody className='text-center'>
                  <div className='text-6xl mb-4'>📍</div>
                  <p className='text-gray-600 text-lg'>
                    No cover photo available
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          <div className='lg:col-span-1 space-y-6'>
            <div className='space-y-4'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
                {location.name}
              </h1>

              {location.address && (
                <div className='flex items-start space-x-3'>
                  <svg
                    className='w-5 h-5 text-gray-500 mt-1 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  <p className='text-lg text-gray-700 leading-relaxed'>
                    {location.address}
                  </p>
                </div>
              )}

              {location.about && (
                <div className='pt-4 border-t border-gray-200'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                    About this location
                  </h2>
                  <p className='text-gray-700 leading-relaxed text-lg'>
                    {location.about}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
