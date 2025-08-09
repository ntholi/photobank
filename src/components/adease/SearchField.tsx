'use client';

import { CloseButton, TextInput, TextInputProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';

export function SearchField(props: TextInputProps) {
  const [value, setValue] = useQueryState('q') ;

  const leftSection = value ? (
    <CloseButton
      onClick={() => {
        setValue(null);
      }}
    />
  ) : (
    <IconSearch size={20} />
  );

  return (
    <TextInput
      placeholder='Search'
      value={value || ''}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      rightSection={leftSection}
      {...props}
    />
  );
}
