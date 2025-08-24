'use client';

import React from 'react';
import { Chip } from '@heroui/chip';
import { ScrollShadow } from '@heroui/scroll-shadow';
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

  function handleTagToggle(tagId: string) {
    const newSelectedTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(newSelectedTags.length > 0 ? newSelectedTags : null);
  }

  if (tagsLoading) {
    return (
      <div className='w-full max-w-3xl mx-auto'>
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
    <div className='w-full max-w-3xl mx-auto'>
      <ScrollShadow orientation='horizontal' size={20} className='w-full'>
        <div className='flex gap-2'>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              variant={selectedTagIds.includes(tag.id) ? 'solid' : 'bordered'}
              color={selectedTagIds.includes(tag.id) ? 'primary' : 'default'}
              onClick={() => handleTagToggle(tag.id)}
              className='cursor-pointer flex-shrink-0'
              isDisabled={isLoading}
            >
              {tag.name}
            </Chip>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
