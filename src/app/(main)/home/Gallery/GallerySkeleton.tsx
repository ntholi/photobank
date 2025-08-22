'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@heroui/skeleton';

interface GallerySkeletonProps {
  itemCount?: number;
}

export function GallerySkeleton({ itemCount = 30 }: GallerySkeletonProps) {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1536) setColumns(5);
      else if (width >= 1024) setColumns(4);
      else if (width >= 768) setColumns(3);
      else if (width >= 640) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const skeletonItems = Array.from({ length: itemCount }, (_, index) => ({
    id: `skeleton-${index}`,
    height: 200 + Math.random() * 200,
  }));

  const columnItems = Array.from({ length: columns }, (_, colIndex) => {
    return skeletonItems.filter((_, index) => index % columns === colIndex);
  });

  return (
    <div className='w-full'>
      <div
        className='grid gap-4 p-4'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {columnItems.map((column, colIndex) => (
          <div key={colIndex} className='flex flex-col gap-4'>
            {column.map((item) => (
              <Skeleton
                key={item.id}
                className='rounded-lg'
                style={{ height: item.height }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
