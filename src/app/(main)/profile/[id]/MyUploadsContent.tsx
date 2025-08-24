'use client';

import React, { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserUploads } from '@/server/content/actions';
import PhotosDisplay from './PhotosDisplay';

type Props = {
  userId: string;
};

type PageItem = {
  id: string;
  thumbnailKey: string;
  description?: string | null;
  fileName?: string | null;
};

type PageData = {
  items: PageItem[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

export default function MyUploadsContent({ userId }: Props) {
  const queryKey = useMemo(() => ['user-uploads', userId] as const, [userId]);

  const uploads = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      getUserUploads(userId, pageParam, 18),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
    staleTime: 60_000,
    enabled: Boolean(userId),
  });

  const uploadItems =
    (uploads.data?.pages as PageData[] | undefined)?.flatMap(
      (p: PageData) => p.items
    ) ?? [];

  return (
    <div className='w-full'>
      <PhotosDisplay items={uploadItems} />
      <LoadMore
        hasMore={Boolean(uploads.hasNextPage)}
        loading={uploads.isFetchingNextPage}
        onLoadMore={() => uploads.fetchNextPage()}
      />
    </div>
  );
}

function LoadMore({
  hasMore,
  loading,
  onLoadMore,
}: {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) return null;
  return (
    <div className='flex justify-center py-6'>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className='px-4 py-2 text-sm rounded-md bg-white/10 hover:bg-white/15 disabled:opacity-50'
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>
    </div>
  );
}
