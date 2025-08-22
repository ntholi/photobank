'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTags } from '@/server/tags/actions';
import Gallery from './index';
import SearchBar from './SearchBar';
import TagsFilter from './TagsFilter';

export default function GallerySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { data: tags = [] } = useQuery({
    queryKey: ['all-tags'],
    queryFn: getAllTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
  };

  return (
    <section className='py-8 bg-gradient-to-br from-background via-default-50/10 to-primary-50/5 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 bg-grid-pattern opacity-3' />
      <div className='absolute top-0 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-2xl' />
      <div className='absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-2xl' />

      <div className='container mx-auto px-4 relative z-10'>
        {/* Compact Header */}
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold mb-3 bg-gradient-to-r from-default-900 via-default-700 to-primary-600 bg-clip-text text-transparent'>
            Discover Lesotho
          </h2>
          <p className='text-lg text-default-600 max-w-2xl mx-auto font-light'>
            Curated collection of stunning photographs and videos showcasing
            Lesotho's beauty and heritage.
          </p>
        </div>

        {/* Compact Search and Filter Controls */}
        <div className='space-y-6 mb-8'>
          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            isLoading={false}
            placeholder='Search photos...'
          />

          {/* Tags Filter */}
          <TagsFilter
            selectedTagIds={selectedTagIds}
            onTagsChange={handleTagsChange}
            isLoading={false}
          />

          {/* Compact Results Summary */}
          {(searchQuery || selectedTagIds.length > 0) && (
            <div className='flex justify-center'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-content2/80 backdrop-blur-sm text-default-700 dark:text-default-300 rounded-xl shadow-sm border border-default-200/30 text-sm'>
                <div className='flex items-center gap-2'>
                  {searchQuery && (
                    <span className='bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-md text-xs'>
                      "{searchQuery}"
                    </span>
                  )}
                  {searchQuery && selectedTagIds.length > 0 && (
                    <span className='text-default-400'>+</span>
                  )}
                  {selectedTagIds.length > 0 && (
                    <span className='bg-secondary-100 dark:bg-secondary-900/30 px-2 py-0.5 rounded-md text-xs'>
                      {selectedTagIds.length} tag
                      {selectedTagIds.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTagIds([]);
                  }}
                  className='text-default-500 hover:text-default-700 dark:text-default-400 dark:hover:text-default-200 text-xs underline underline-offset-2 transition-colors duration-200'
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className='mt-8'>
          <Gallery search={searchQuery} tagIds={selectedTagIds} />
        </div>
      </div>
    </section>
  );
}
