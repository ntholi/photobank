import { content as contentSchema, locations } from '@/db/schema';
import {
  extractDominantColors,
  generateGradient,
  getDefaultColors,
} from '@/lib/colors';
import { getImageUrl } from '@/lib/utils';
import { MdLocationOn } from 'react-icons/md';
import LocationTabs from './LocationTabs';
import CoverCarousel from './CoverCarousel';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

interface LocationHeroProps {
  location: Location & {
    coverContent: Content | null;
    coverContents?: Content[];
    about: string | null;
    virtualTourUrl?: string | null;
  };
}

export async function LocationHero({ location }: LocationHeroProps) {
  const hasCoverContent =
    (location.coverContents && location.coverContents.length > 0) ||
    location.coverContent !== null;

  async function getDominantColors(): Promise<string[]> {
    try {
      const first =
        (location.coverContents && location.coverContents[0]) ||
        location.coverContent;
      if (!first || !first.thumbnailKey) {
        return getDefaultColors();
      }

      const url = getImageUrl(first.thumbnailKey);
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
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          <div className='lg:col-span-1'>
            <CoverCarousel
              items={
                location.coverContents ??
                (location.coverContent ? [location.coverContent] : [])
              }
              locationName={location.name}
            />
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
