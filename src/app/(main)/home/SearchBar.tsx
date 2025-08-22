'use client';

import React, { useState, useCallback } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { SearchIcon } from '@heroui/shared-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = 'Search photos and videos...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query.trim());
    },
    [query, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='relative'>
        <form
          onSubmit={handleSubmit}
          className='flex gap-2 p-2 bg-white/70 dark:bg-content2/70 backdrop-blur-sm rounded-xl shadow-sm border border-default-200/30'
        >
          <div className='flex-1 relative'>
            <Input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              startContent={
                <SearchIcon
                  className='text-default-400 flex-shrink-0'
                  width={18}
                  height={18}
                />
              }
              endContent={
                query && (
                  <button
                    type='button'
                    onClick={handleClear}
                    className='text-default-400 hover:text-default-600 transition-colors duration-200 flex-shrink-0'
                  >
                    <span className='text-base font-light'>×</span>
                  </button>
                )
              }
              className='border-0 bg-transparent shadow-none'
              classNames={{
                input: 'text-sm placeholder:text-default-400',
                inputWrapper: 'shadow-none bg-transparent border-0 h-10',
              }}
              isDisabled={isLoading}
            />
          </div>
          <Button
            type='submit'
            isLoading={isLoading}
            color='primary'
            variant='solid'
            size='sm'
            className='px-6 font-medium shadow-sm hover:shadow-md transition-all duration-200'
          >
            {isLoading ? '...' : 'Search'}
          </Button>
        </form>

        {/* Subtle glow effect */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3 rounded-xl blur-lg -z-10 opacity-40' />
      </div>
    </div>
  );
}
