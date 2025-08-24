'use client';

import { useMemo } from 'react';
import { Button } from '@heroui/button';
import {
  isContentSaved,
  toggleSaveContent,
} from '@/server/saved-contents/actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoMdHeart, IoMdShare } from 'react-icons/io';

type Props = {
  contentId: string;
};

export default function ActionBar({ contentId }: Props) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['is-saved', contentId] as const, [contentId]);
  const query = useQuery({
    queryKey,
    queryFn: () => isContentSaved(contentId),
    staleTime: 60_000,
    enabled: Boolean(contentId),
  });
  const mutation = useMutation({
    mutationFn: () => toggleSaveContent(contentId),
    onMutate: async () => {
      const prev = queryClient.getQueryData<boolean>(queryKey);
      queryClient.setQueryData<boolean>(queryKey, !prev);
      return { prev } as { prev: boolean | undefined };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== undefined)
        queryClient.setQueryData<boolean>(queryKey, ctx.prev);
    },
    onSuccess: (res) => {
      queryClient.setQueryData<boolean>(queryKey, res.saved);
    },
  });

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this content',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className='flex gap-2 mb-4'>
      <Button
        variant={query.data ? 'solid' : 'flat'}
        color={query.data ? 'danger' : 'default'}
        isIconOnly
        startContent={<IoMdHeart size={20} />}
        isLoading={query.isLoading || mutation.isPending}
        onPress={() => mutation.mutate()}
        radius='sm'
        aria-pressed={Boolean(query.data)}
        className='flex-1'
      />
      <Button
        variant='flat'
        color='default'
        isIconOnly
        startContent={<IoMdShare size={20} />}
        onPress={handleShare}
        radius='sm'
        className='flex-1'
      />
    </div>
  );
}
