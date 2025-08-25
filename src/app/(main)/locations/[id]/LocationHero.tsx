import { content as contentSchema, locations } from '@/db/schema';
import {
  extractDominantColors,
  generateGradient,
  getDefaultColors,
} from '@/lib/colors';
import { getImageUrl } from '@/lib/utils';
import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { MdLocationOn } from 'react-icons/md';
import LocationTabs from './LocationTabs';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

interface LocationHeroProps {
  location: Location & {
    coverContent: Content | null;
    about: string | null;
    virtualTourUrl?: string | null;
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
                  <div className='mb-4 text-6xl'>
                    <MdLocationOn className='mx-auto h-12 w-12 text-gray-500' />
                  </div>
                  <p className='text-lg text-gray-600'>
                    No cover photo available
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          <div className='space-y-3 lg:col-span-1'>
            <h1 className='text-4xl leading-tight font-bold text-gray-900 md:text-5xl'>
              {location.name}
            </h1>

            {location.address && (
              <div className='flex items-start space-x-3'>
                <MdLocationOn className='mt-1 h-5 w-5 flex-shrink-0 text-gray-500' />
                <p className='text-lg leading-relaxed text-gray-700'>
                  {location.address}
                </p>
              </div>
            )}

            <LocationTabs location={location} />
          </div>
        </div>
      </div>
    </div>
  );
}
