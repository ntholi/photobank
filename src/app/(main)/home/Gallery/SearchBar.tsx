'use client';

import React from 'react';
import { Input } from '@heroui/input';
import { SearchIcon } from '@heroui/shared-icons';
import { useQueryState, parseAsString } from 'nuqs';

interface SearchBarProps {
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  isLoading = false,
  placeholder = 'Search photos and videos...',
}: SearchBarProps) {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));

  function handleClear() {
    setQuery(null);
  }

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <Input
        type='search'
        size='lg'
        value={query}
        onValueChange={setQuery}
        onClear={handleClear}
        variant='faded'
        placeholder={placeholder}
        startContent={
          <SearchIcon
            className='text-default-400 flex-shrink-0'
            width={18}
            height={18}
          />
        }
        isClearable
        isDisabled={isLoading}
        className='w-full'
      />
    </div>
  );
}
