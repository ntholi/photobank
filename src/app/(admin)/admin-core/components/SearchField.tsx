import { Box, CloseButton, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';

type Props = {};

export default function SearchField({}: Props) {
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
    <Box p='md' pt={0}>
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
