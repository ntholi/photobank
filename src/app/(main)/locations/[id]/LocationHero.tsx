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
import AboutDrawer from './AboutDrawer';

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
      className='relative w-full overflow-hidden'
      style={{
        background: generateGradient(dominantColors, 0.2),
      }}
    >
      <div className='mx-auto max-w-7xl px-4 py-12'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <div className='lg:col-span-1'>
            {hasCoverContent && location.coverContent ? (
              <div className='rounded-xl p-0.5 shadow-lg'>
                <Image
                  src={getImageUrl(location.coverContent.watermarkedKey)}
                  alt={`${location.name} - Cover photo`}
                  className='h-auto max-h-[60vh] w-full object-contain'
                  loading='eager'
                  radius='lg'
                  width={800}
                  height={600}
                />
              </div>
            ) : (
              <Card className='flex h-64 items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50'>
                <CardBody className='text-center'>
                  <div className='mb-4 text-6xl'>📍</div>
                  <p className='text-lg text-gray-600'>
                    No cover photo available
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          <div className='space-y-6 lg:col-span-1'>
            <div className='space-y-4'>
              <h1 className='text-4xl leading-tight font-bold text-gray-900 md:text-5xl'>
                {location.name}
              </h1>

              {location.address && (
                <div className='flex items-start space-x-3'>
                  <svg
                    className='mt-1 h-5 w-5 flex-shrink-0 text-gray-500'
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
                  <p className='text-lg leading-relaxed text-gray-700'>
                    {location.address}
                  </p>
                </div>
              )}

              {location.about && (
                <div className='border-t border-gray-200 pt-4'>
                  <h2 className='mb-3 text-xl font-semibold text-gray-900'>
                    About this location
                  </h2>
                  <AboutDrawer
                    rawHtml={location.about}
                    title={`About ${location.name}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
