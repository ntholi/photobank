'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@heroui/input';
import { SearchIcon } from '@heroui/shared-icons';
import { useDebounce } from '@/hooks/useDebounce';

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
  const debouncedQuery = useDebounce(query.trim(), 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

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
