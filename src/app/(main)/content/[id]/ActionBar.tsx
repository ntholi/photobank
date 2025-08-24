'use client';

import { useMemo, useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Card, CardBody } from '@heroui/card';
import {
  isContentSaved,
  toggleSaveContent,
} from '@/server/saved-contents/actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoMdHeart, IoMdShare, IoMdCheckmark } from 'react-icons/io';

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

  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this content',
          url: window.location.href,
        });
        setShareStatus('copied');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('copied');
      }
    } catch {
      setShareStatus('error');
    }
  }

  useEffect(() => {
    if (shareStatus === 'idle') return;
    const id = window.setTimeout(() => setShareStatus('idle'), 1500);
    return () => window.clearTimeout(id);
  }, [shareStatus]);

  return (
    <Card className='shadow-none border border-default-200'>
      <CardBody className='p-6'>
        <div className='flex gap-2'>
          <Button
            variant={query.data ? 'solid' : 'flat'}
            color={query.data ? 'danger' : 'default'}
            startContent={<IoMdHeart size={16} />}
            isLoading={query.isLoading || mutation.isPending}
            onPress={() => mutation.mutate()}
            radius='full'
            aria-pressed={Boolean(query.data)}
            aria-label={query.data ? 'Unsave' : 'Save'}
            className='flex-1'
            size='sm'
          >
            <span className='hidden sm:inline'>
              {query.data ? 'Saved' : 'Save'}
            </span>
          </Button>
          <Button
            variant='flat'
            color='primary'
            startContent={
              shareStatus === 'copied' ? (
                <IoMdCheckmark size={16} />
              ) : (
                <IoMdShare size={16} />
              )
            }
            onPress={handleShare}
            radius='full'
            aria-label={
              shareStatus === 'copied'
                ? 'Copied'
                : shareStatus === 'error'
                  ? 'Failed'
                  : 'Share'
            }
            className='flex-1'
            size='sm'
          >
            <span className='hidden sm:inline'>
              {shareStatus === 'copied'
                ? 'Copied'
                : shareStatus === 'error'
                  ? 'Failed'
                  : 'Share'}
            </span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
