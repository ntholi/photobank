'use client';

import React from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { Image } from '@heroui/image';

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
            className='relative group aspect-square overflow-hidden focus:outline-none block'
            aria-label='Open content'
          >
            <Image
              src={getImageUrl(item.thumbnailKey)}
              alt={item.description || item.fileName || 'Photo'}
              className='h-full w-full object-cover'
              loading='lazy'
              fallbackSrc='/photo_session.svg'
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
