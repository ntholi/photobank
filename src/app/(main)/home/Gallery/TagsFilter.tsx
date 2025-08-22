'use client';

import React, { useState, useEffect } from 'react';
import { Chip } from '@heroui/chip';
import { useQuery } from '@tanstack/react-query';
import { getAllTags } from '@/server/tags/actions';

interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | null;
}

interface TagsFilterProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  isLoading?: boolean;
}

export default function TagsFilter({
  selectedTagIds,
  onTagsChange,
  isLoading = false,
}: TagsFilterProps) {
  const [localSelectedTags, setLocalSelectedTags] =
    useState<string[]>(selectedTagIds);

  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['all-tags'],
    queryFn: getAllTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    setLocalSelectedTags(selectedTagIds);
  }, [selectedTagIds]);

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = localSelectedTags.includes(tagId)
      ? localSelectedTags.filter((id) => id !== tagId)
      : [...localSelectedTags, tagId];

    setLocalSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  const handleClearAll = () => {
    setLocalSelectedTags([]);
    onTagsChange([]);
  };

  if (tagsLoading) {
    return (
      <div className='w-full max-w-4xl mx-auto'>
        <div className='bg-white/70 dark:bg-content2/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-default-200/30'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-base font-semibold text-default-800'>
              Filter by Tags
            </h3>
          </div>
          <div className='relative'>
            <div className='flex gap-2 overflow-x-auto scrollbar-hide pr-6'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className='h-7 w-16 bg-default-200 rounded-full animate-pulse flex-shrink-0'
                />
              ))}
            </div>
            <div className='absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/70 dark:from-content2/70 to-transparent pointer-events-none' />
          </div>
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className='bg-white/70 dark:bg-content2/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-default-200/30'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-base font-semibold text-default-800'>
            Filter by Tags
          </h3>
          {localSelectedTags.length > 0 && (
            <Chip
              size='sm'
              variant='flat'
              color='primary'
              onClick={handleClearAll}
              className='cursor-pointer font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs'
            >
              Clear ({localSelectedTags.length})
            </Chip>
          )}
        </div>

        <div className='relative'>
          <div className='flex gap-2 overflow-x-auto scrollbar-hide pr-6'>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                variant={
                  localSelectedTags.includes(tag.id) ? 'solid' : 'bordered'
                }
                color={
                  localSelectedTags.includes(tag.id) ? 'primary' : 'default'
                }
                size='sm'
                onClick={() => handleTagToggle(tag.id)}
                className={`cursor-pointer transition-all duration-200 font-medium flex-shrink-0 text-xs ${
                  localSelectedTags.includes(tag.id)
                    ? 'shadow-sm hover:shadow-md'
                    : 'hover:bg-default-100 hover:border-default-300'
                }`}
                isDisabled={isLoading}
              >
                {tag.name}
              </Chip>
            ))}
          </div>
          <div className='absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/70 dark:from-content2/70 to-transparent pointer-events-none' />
        </div>

        {localSelectedTags.length > 0 && (
          <div className='mt-3 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200/30'>
            <div className='flex items-center justify-between'>
              <div className='text-xs text-primary-700 dark:text-primary-300 font-medium'>
                {localSelectedTags.length} tag
                {localSelectedTags.length > 1 ? 's' : ''} selected
              </div>
              <button
                onClick={handleClearAll}
                className='text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 text-xs underline underline-offset-2'
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
