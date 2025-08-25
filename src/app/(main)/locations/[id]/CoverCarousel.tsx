'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { content as contentSchema } from '@/db/schema';
import CoverContentCard from './CoverContentCard';
import { Button } from '@heroui/button';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type Content = typeof contentSchema.$inferSelect;

export default function CoverCarousel({
  items,
  locationName,
}: {
  items: Content[];
  locationName: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: items.length > 1 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(items.length > 1);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className='relative'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {items.length === 0 ? (
            <div className='min-w-0 flex-[0_0_100%] px-1'>
              <CoverContentCard
                content={null}
                alt={`${locationName} - Cover photo`}
              />
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className='min-w-0 flex-[0_0_100%] px-1'>
                <CoverContentCard
                  content={item}
                  alt={`${locationName} - Cover photo`}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {items.length > 1 && (
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
