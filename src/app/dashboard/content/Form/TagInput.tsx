'use client';

import { TagsInput, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getPopularTags } from '@/server/tags/actions';
import { useState } from 'react';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function TagInput({
  value = [],
  onChange,
  label = 'Tags',
  placeholder = 'Select or type tags',
  required = false,
}: TagInputProps) {
  const [search, setSearch] = useState('');

  const { data: availableTags, isLoading } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: getPopularTags,
  });

  const tagNames =
    (availableTags as Array<{ name: string }>)?.map((tag) => tag.name) || [];

  return (
    <Stack gap='xs'>
      <TagsInput
        label={label}
        description='Leave tags empty for automatic AI-generated tags based on image content'
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        data={tagNames}
        searchValue={search}
        onSearchChange={setSearch}
        comboboxProps={{
          dropdownPadding: 0,
        }}
        filter={({ options }) => options}
      />
    </Stack>
  );
}
