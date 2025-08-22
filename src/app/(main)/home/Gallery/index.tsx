'use client';

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getGalleryContent } from '@/server/content/actions';
import { Masonry } from './Masonry';
import { GallerySkeleton } from './GallerySkeleton';
import { getImageUrl } from '@/lib/utils';

export interface GalleryContent {
  id: string;
  type: 'image' | 'video';
  description?: string | null;
  fileName?: string | null;
  thumbnailKey: string;
  createdAt: Date | null;
}

export interface GalleryPage {
  items: GalleryContent[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export interface InfiniteGalleryResponse {
  pages: GalleryPage[];
  pageParams: number[];
}

interface GalleryProps {
  search?: string;
  tagIds?: string[];
}

export default function Gallery({ search, tagIds }: GalleryProps) {
  const queryKey = ['gallery-content', search || '', tagIds || []];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getGalleryContent(pageParam, search, tagIds),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return <GallerySkeleton />;
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>
            Error loading gallery: {error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id='gallery' className='w-full'>
      <Masonry
        items={allItems}
        renderItem={(item) => <GalleryItem item={item} />}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
    </div>
  );
}

interface GalleryItemProps {
  item: GalleryContent;
}

function GalleryItem({ item }: GalleryItemProps) {
  const router = useRouter();
  const thumbnailUrl = getImageUrl(item.thumbnailKey);

  const handleClick = () => {
    router.push(`/content/${item.id}`);
  };

  return (
    <div className='overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300'>
      <div className='relative cursor-pointer group' onClick={handleClick}>
        <img
          src={thumbnailUrl}
          alt={item.description || item.fileName || 'Gallery image'}
          className='w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-70'
          loading='lazy'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/photo_session.svg';
          }}
        />
      </div>
    </div>
  );
}
