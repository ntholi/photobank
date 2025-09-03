'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { content as contentSchema } from '@/db/schema';
import CoverContentCard from './CoverContentCard';
import { Button } from '@heroui/button';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type Content = typeof contentSchema.$inferSelect;

interface ImageWithColors {
  content: Content;
  dominantColors: string[];
  gradient: string;
}

interface DynamicCoverCarouselProps {
  images: ImageWithColors[];
  locationName: string;
  onSlideChange: (index: number) => void;
}

export default function DynamicCoverCarousel({
  images,
  locationName,
  onSlideChange,
}: DynamicCoverCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(images.length > 1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    // Notify parent component about slide change
    onSlideChange(index);
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const contents = images.map((img) => img.content);

  return (
    <div className='relative'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {contents.length === 0 ? (
            <div className='min-w-0 flex-[0_0_100%] px-1'>
              <CoverContentCard
                content={null}
                alt={`${locationName} - Cover photo`}
              />
            </div>
          ) : (
            contents.map((item, index) => (
              <div
                key={item.id || index}
                className='min-w-0 flex-[0_0_100%] px-1'
              >
                <CoverContentCard
                  content={item}
                  alt={`${locationName} - Cover photo`}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className='pointer-events-none absolute inset-y-1/2 right-0 left-0 -translate-y-1/2 transform px-2'>
          <div className='flex justify-between'>
            <Button
              isIconOnly
              radius='full'
              variant='flat'
              className='pointer-events-auto bg-white/70 shadow'
              onPress={() => emblaApi?.scrollPrev()}
              isDisabled={!canScrollPrev}
            >
              <MdChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              isIconOnly
              radius='full'
              variant='flat'
              className='pointer-events-auto bg-white/70 shadow'
              onPress={() => emblaApi?.scrollNext()}
              isDisabled={!canScrollNext}
            >
              <MdChevronRight className='h-6 w-6' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
