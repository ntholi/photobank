'use client';

import React, { useEffect } from 'react';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';
import Gallery from './index';
import SearchBar from './SearchBar';
import TagsFilter from './TagsFilter';

export default function GallerySection() {
  const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [selectedTagIds] = useQueryState(
    'tags',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  useEffect(() => {
    if (window.location.hash === '#gallery') {
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedTagIds]);

  function clearFilters() {
    window.history.pushState({}, '', window.location.pathname);
  }

  return (
    <section
      id='gallery'
      className='py-8 bg-gradient-to-br from-background via-default-50/10 to-primary-50/5 relative overflow-hidden'
    >
      <div className='absolute inset-0 bg-grid-pattern opacity-3' />
      <div className='absolute top-0 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-2xl' />
      <div className='absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-2xl' />

      <div className='container mx-auto px-4 relative z-10'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold mb-3 bg-gradient-to-r from-default-900 via-default-700 to-primary-600 bg-clip-text text-transparent'>
            Discover Lesotho
          </h2>
          <p className='text-lg text-default-600 max-w-2xl mx-auto font-light'>
            Curated collection of stunning photographs and videos showcasing
            Lesotho's beauty and heritage.
          </p>
        </div>

        <div className='space-y-6 mb-8'>
          <SearchBar isLoading={false} placeholder='Search photos...' />
          <TagsFilter isLoading={false} />
        </div>

        <div className='mt-8'>
          <Gallery search={searchQuery} tagIds={selectedTagIds} />
        </div>
      </div>
    </section>
  );
}
