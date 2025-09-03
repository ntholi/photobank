'use client';

import { content as contentSchema, locations } from '@/db/schema';
import { useState, useEffect, useCallback } from 'react';
import { MdLocationOn } from 'react-icons/md';
import LocationTabs from './LocationTabs';
import DynamicCoverCarousel from './DynamicCoverCarousel';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

interface ImageWithColors {
  content: Content;
  dominantColors: string[];
  gradient: string;
}

interface LocationHeroDisplayProps {
  images: ImageWithColors[];
  location: Location & {
    coverContent: Content | null;
    coverContents?: Content[];
    about: string | null;
    virtualTourUrl?: string | null;
  };
}

export default function LocationHeroDisplay({
  images,
  location,
}: LocationHeroDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>(
    {},
  );

  const updateBackground = useCallback(
    (index: number) => {
      const currentImage = images[index];
      if (currentImage) {
        setBackgroundStyle({
          background: currentImage.gradient,
          transition: 'background 0.5s ease-in-out',
        });
      }
    },
    [images],
  );

  useEffect(() => {
    updateBackground(currentIndex);
  }, [currentIndex, updateBackground]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className='relative w-full overflow-hidden' style={backgroundStyle}>
      <div className='mx-auto max-w-7xl px-4 py-12'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          <div className='lg:col-span-1'>
            <DynamicCoverCarousel
              images={images}
              locationName={location.name}
              onSlideChange={handleSlideChange}
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
