'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    skipSnaps: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(images.length > 1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselId = useId();

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

  const contents = useMemo(() => images.map((img) => img.content), [images]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!emblaApi) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        emblaApi.scrollPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        emblaApi.scrollNext();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        emblaApi.scrollTo(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        emblaApi.scrollTo(contents.length - 1);
      }
    },
    [emblaApi, contents.length],
  );

  return (
    <div
      className='group relative'
      aria-roledescription='carousel'
      aria-label={`${locationName} cover images`}
    >
      <Card className='shadow-lg' radius='sm'>
        <CardBody className='p-0'>
          <div
            id={carouselId}
            className='overflow-hidden outline-none select-none'
            ref={emblaRef}
            role='region'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-live='polite'
            aria-atomic='true'
          >
            <div className='flex touch-pan-y'>
              {contents.length === 0 ? (
                <div className='min-w-0 flex-[0_0_100%]'>
                  <div className='border-default-200 bg-content1 flex h-[50vh] items-center justify-center rounded-md border border-dashed'>
                    <div className='text-center'>
                      <div className='mb-3'>
                        <MdLocationOn className='text-default-500 mx-auto h-10 w-10' />
                      </div>
                      <p className='text-medium text-default-600'>
                        No cover photo available
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                images.map((img, index) => {
                  const item = img.content;
                  const gradient =
                    img.gradient ||
                    `linear-gradient(135deg, ${img.dominantColors?.[0] ?? '#111827'}, ${img.dominantColors?.[1] ?? '#374151'})`;
                  return (
                    <div
                      key={item.id || index}
                      className='min-w-0 flex-[0_0_100%]'
                    >
                      <div className='relative h-[50vh] w-full sm:h-[60vh]'>
                        <div
                          className='absolute inset-0 rounded-md'
                          style={{ backgroundImage: gradient }}
                        />
                        <div className='absolute inset-0 rounded-md bg-black/10 dark:bg-black/30' />
                        <div className='relative flex h-full w-full items-center justify-center p-4'>
                          <Image
                            src={getImageUrl(item.watermarkedKey)}
                            alt={`${locationName} – image ${index + 1} of ${images.length}`}
                            className='max-h-full w-auto rounded-md object-contain shadow-sm'
                            loading='eager'
                            radius='md'
                            width={1600}
                            height={1200}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {images.length > 1 && (
        <div className='pointer-events-none absolute inset-0'>
          <div className='absolute inset-y-0 right-0 left-0 flex items-center justify-between px-2'>
            <Button
              aria-label='Previous image'
              isIconOnly
              radius='full'
              variant='flat'
              className='bg-background/80 hover:bg-background/90 pointer-events-auto shadow-lg backdrop-blur-md transition-colors duration-200'
              onPress={() => emblaApi?.scrollPrev()}
              isDisabled={!canScrollPrev}
            >
              <MdChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              aria-label='Next image'
              isIconOnly
              radius='full'
              variant='flat'
              className='bg-background/80 hover:bg-background/90 pointer-events-auto shadow-lg backdrop-blur-md transition-colors duration-200'
              onPress={() => emblaApi?.scrollNext()}
              isDisabled={!canScrollNext}
            >
              <MdChevronRight className='h-6 w-6' />
            </Button>
          </div>

          <div className='absolute right-0 bottom-4 left-0 flex items-center justify-center'>
            <div className='bg-background/80 flex items-center gap-1.5 rounded-full px-3 py-2 shadow-lg backdrop-blur-md'>
              {images.map((_, i) => (
                <button
                  key={i}
                  type='button'
                  aria-label={`Go to slide ${i + 1}`}
                  aria-controls={carouselId}
                  className={
                    'focus:ring-primary focus:ring-offset-background/80 rounded-full transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ' +
                    (i === selectedIndex
                      ? 'bg-primary h-3 w-8 shadow-sm'
                      : 'bg-foreground/30 hover:bg-foreground/50 h-3 w-3 hover:scale-110')
                  }
                  onClick={() => emblaApi?.scrollTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
