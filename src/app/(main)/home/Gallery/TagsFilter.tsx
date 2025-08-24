'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { getAllTags } from '@/server/tags/actions';

interface Props {
  isLoading?: boolean;
}

export default function TagsFilter({ isLoading = false }: Props) {
  const [selectedTagIds, setSelectedTagIds] = useQueryState(
    'tags',
    parseAsArrayOf(parseAsString).withDefault([])
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

  function handleTagToggle(tagId: string) {
    const newSelectedTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(newSelectedTags.length > 0 ? newSelectedTags : null);
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
    <div className='w-full max-w-3xl mx-auto relative'>
      {canScrollLeft && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 z-10'>
          <Button
            isIconOnly
            size='sm'
            variant='flat'
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
            variant='flat'
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
        className='w-full overflow-x-auto overflow-y-hidden px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
        onScroll={updateScrollState}
      >
        <div className='flex items-center gap-2 py-1'>
          <Chip
            key='all-tags'
            variant={selectedTagIds.length === 0 ? 'solid' : 'flat'}
            color={selectedTagIds.length === 0 ? 'primary' : 'default'}
            onClick={() => setSelectedTagIds(null)}
            className='cursor-pointer flex-shrink-0'
            radius='full'
            size='sm'
            aria-pressed={selectedTagIds.length === 0}
            isDisabled={isLoading}
          >
            All
          </Chip>
          {sortedTags.map((tag) => {
            const selected = selectedTagIds.includes(tag.id);
            return (
              <Chip
                key={tag.id}
                variant={selected ? 'solid' : 'flat'}
                color={selected ? 'primary' : 'default'}
                onClick={() => handleTagToggle(tag.id)}
                className='cursor-pointer flex-shrink-0'
                radius='full'
                size='sm'
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
