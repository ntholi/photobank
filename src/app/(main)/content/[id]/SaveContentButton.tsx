'use client';

import { useMemo } from 'react';
import { Button } from '@heroui/button';
import {
  isContentSaved,
  toggleSaveContent,
} from '@/server/saved-contents/actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoMdHeart } from 'react-icons/io';

type Props = {
  contentId: string;
};

export default function SaveContentButton({ contentId }: Props) {
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

  return (
    <Button
      variant={query.data ? 'solid' : 'flat'}
      color={query.data ? 'danger' : 'default'}
      startContent={<IoMdHeart size={18} />}
      isLoading={query.isLoading || mutation.isPending}
      onPress={() => mutation.mutate()}
      radius='sm'
      className='w-full'
      aria-pressed={Boolean(query.data)}
    >
      {query.data ? 'Saved' : 'Save'}
    </Button>
  );
}
