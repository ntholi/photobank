'use client';

import { content as contentSchema } from '@/db/schema';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import ContentItemCard from '../../content/[id]/ContentItemCard';

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
        <div className='mx-auto max-w-7xl px-4 text-center'>
          <div className='mb-6 text-6xl'>📷</div>
          <h3 className='text-foreground mb-2 text-2xl font-semibold'>
            No photos available
          </h3>
          <p className='text-foreground/70 text-lg'>
            There are currently no published photos from {locationName}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full py-12'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='mb-8'>
          <h2 className='text-foreground mb-2 text-2xl font-bold'>
            Photos from {locationName}
          </h2>
          <p className='text-foreground/70'>
            {content.length} photo{content.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {content.map((item) => (
            <ContentItemCard key={item.id} item={item} />
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
