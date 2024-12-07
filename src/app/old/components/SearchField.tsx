'use client';
import { Box, BoxProps, CloseButton, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';

export default function SearchField(props: BoxProps) {
  const [value, setValue] = React.useState('');

  const leftSection = value ? (
    <CloseButton
      onClick={() => {
        setValue('');
        // onSearch('');
      }}
    />
  ) : (
    <IconSearch size={20} />
  );

  return (
    <Box pt={0} {...props}>
      <TextInput
        placeholder='Search'
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          // onSearch(event.currentTarget.value);
        }}
        rightSection={leftSection}
      />
    </Box>
  );
}
