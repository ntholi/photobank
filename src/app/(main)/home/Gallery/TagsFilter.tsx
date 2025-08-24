'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsString } from 'nuqs';
import { getAllTags } from '@/server/tags/actions';

interface Props {
  isLoading?: boolean;
}

export default function TagsFilter({ isLoading = false }: Props) {
  const [selectedTagId, setSelectedTagId] = useQueryState(
    'tags',
    parseAsString.withDefault('')
  );

  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['all-tags'],
    queryFn: getAllTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.name.localeCompare(b.name)),
    [tags]
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
  }

  function handleScrollLeft() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -240, behavior: 'smooth' });
  }

  function handleScrollRight() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 240, behavior: 'smooth' });
  }

  useEffect(
    function setupScrollListeners() {
      const el = scrollRef.current;
      if (!el) return;
      updateScrollState();
      function onScroll() {
        updateScrollState();
      }
      function onResize() {
        updateScrollState();
      }
      el.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      return function cleanup() {
        el.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    },
    [sortedTags.length]
  );

  function handleTagSelect(tagId: string) {
    setSelectedTagId(selectedTagId === tagId ? '' : tagId);
  }

  if (tagsLoading) {
    return (
      <div className='w-full max-w-2xl mx-auto'>
        <div className='flex gap-2'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='h-7 w-16 bg-default-200 rounded-full animate-pulse flex-shrink-0'
            />
          ))}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className='w-full max-w-5xl mx-auto relative'>
      {canScrollLeft && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 z-10'>
          <Button
            isIconOnly
            size='sm'
            variant='solid'
            radius='full'
            onPress={handleScrollLeft}
            isDisabled={isLoading}
            aria-label='Scroll left'
            className='shadow-sm'
          >
            <IconChevronLeft size={18} />
          </Button>
        </div>
      )}
      {canScrollRight && (
        <div className='absolute right-0 top-1/2 -translate-y-1/2 z-10'>
          <Button
            isIconOnly
            size='sm'
            variant='solid'
            radius='full'
            onPress={handleScrollRight}
            isDisabled={isLoading}
            aria-label='Scroll right'
            className='shadow-sm'
          >
            <IconChevronRight size={18} />
          </Button>
        </div>
      )}
      <div
        ref={scrollRef}
        className='w-full overflow-x-auto rounded-3xl overflow-y-hidden px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
        onScroll={updateScrollState}
      >
        <div className='flex items-center gap-2 py-1'>
          <Chip
            key='all-tags'
            variant={!selectedTagId ? 'solid' : 'flat'}
            color={!selectedTagId ? 'primary' : 'default'}
            onClick={() => setSelectedTagId('')}
            className='cursor-pointer flex-shrink-0'
            radius='full'
            aria-pressed={!selectedTagId}
            isDisabled={isLoading}
          >
            All
          </Chip>
          {sortedTags.map((tag) => {
            const selected = selectedTagId === tag.id;
            return (
              <Chip
                key={tag.id}
                variant={selected ? 'solid' : 'flat'}
                color={selected ? 'primary' : 'default'}
                onClick={() => handleTagSelect(tag.id)}
                className='cursor-pointer flex-shrink-0'
                radius='full'
                aria-pressed={selected}
                isDisabled={isLoading}
              >
                {tag.name}
              </Chip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
