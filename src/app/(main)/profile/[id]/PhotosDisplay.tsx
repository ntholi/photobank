'use client';

import { getImageUrl } from '@/lib/utils';
import { Image } from '@heroui/image';
import Link from 'next/link';

type GridItem = {
  id: string;
  thumbnailKey: string;
  description?: string | null;
  fileName?: string | null;
};

type Props = {
  items: GridItem[];
};

export default function PhotosDisplay({ items }: Props) {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-3 gap-1 sm:gap-1 md:gap-1 lg:gap-1'>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/content/${item.id}`}
            className='group relative block aspect-square overflow-hidden focus:outline-none'
            aria-label='Open content'
          >
            <Image
              src={getImageUrl(item.thumbnailKey)}
              alt={item.description || item.fileName || 'Photo'}
              className='h-full w-full object-cover'
              isZoomed
              radius='none'
              width={400}
              height={400}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
