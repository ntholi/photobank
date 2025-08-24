'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GalleryContent } from './index';

interface MasonryProps {
  items: GalleryContent[];
  renderItem: (item: GalleryContent) => React.ReactNode;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
}

export function Masonry({
  items,
  renderItem,
  fetchNextPage,
  hasNextPage,
  isFetching,
}: MasonryProps) {
  const [columns, setColumns] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1600) setColumns(5);
      else if (width >= 1200) setColumns(4);
      else if (width >= 768) setColumns(3);
      else if (width >= 640) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  const columnItems = Array.from({ length: columns }, (_, colIndex) => {
    return items.filter((_, index) => index % columns === colIndex);
  });

  return (
    <div className='w-full'>
      <div
        className='grid gap-4 p-4'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: 'minmax(100px, auto)',
        }}
      >
        {columnItems.map((column, colIndex) => (
          <div key={colIndex} className='flex flex-col gap-4'>
            {column.map((item) => (
              <div
                key={item.id}
                className='break-inside-avoid'
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0,
                  transform: 'translateY(20px)',
                }}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className='h-4 w-full' />

      {isFetching && (
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        </div>
      )}

      {!hasNextPage && items.length > 0 && (
        <div className='text-center py-8 text-gray-500'>
          You've reached the end of the gallery
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
