'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { content as contentSchema } from '@/db/schema';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { MdChevronLeft, MdChevronRight, MdLocationOn } from 'react-icons/md';
import { getImageUrl } from '@/lib/utils';

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
      <Card className='shadow-lg' radius='sm'>
        <CardBody className='p-5'>
          <div className='overflow-hidden select-none' ref={emblaRef}>
            <div className='flex touch-pan-y'>
              {contents.length === 0 ? (
                <div className='min-w-0 flex-[0_0_100%]'>
                  <div className='flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
                    <div className='text-center'>
                      <div className='mb-4'>
                        <MdLocationOn className='mx-auto h-12 w-12 text-gray-500' />
                      </div>
                      <p className='text-lg text-gray-600'>
                        No cover photo available
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                contents.map((item, index) => (
                  <div
                    key={item.id || index}
                    className='min-w-0 flex-[0_0_100%]'
                  >
                    <Image
                      src={getImageUrl(item.watermarkedKey)}
                      alt={`${locationName} - Cover photo`}
                      className='h-auto max-h-[60vh] w-full object-contain'
                      loading='eager'
                      radius='lg'
                      width={800}
                      height={600}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </CardBody>
      </Card>

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
