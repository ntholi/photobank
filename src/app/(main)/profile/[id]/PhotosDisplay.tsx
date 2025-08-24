'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

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
  const router = useRouter();

  function open(id: string) {
    router.push(`/content/${id}`);
  }

  return (
    <div className='w-full'>
      <div className='grid grid-cols-3 gap-1 sm:gap-1 md:gap-1 lg:gap-1'>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => open(item.id)}
            className='relative group aspect-square overflow-hidden focus:outline-none'
            aria-label='Open content'
          >
            <img
              src={getImageUrl(item.thumbnailKey)}
              alt={item.description || item.fileName || 'Photo'}
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/photo_session.svg';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
