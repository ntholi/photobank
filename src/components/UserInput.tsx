'use client';

import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { useState, forwardRef } from 'react';
import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

type UserOption = {
  value: string;
  label: string;
};

interface Props extends Omit<AutocompleteProps, 'data'> {
  label?: string;
  value?: string;
  onChange?: (value: string | null) => void;
}

export default forwardRef<HTMLInputElement, Props>(function UserInput(
  { value, onChange, label, ...props },
  ref,
) {
  const [search, setSearch] = useState('');

  const { data: users = [] } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      if (!search) return [];
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(search)}`,
      );
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: search.length > 0,
  });

  const options: UserOption[] = users.map((user: User) => ({
    value: user.id,
    label: user.name || user.email || user.id,
  }));

  return (
    <Autocomplete
      ref={ref}
      label={label || 'User'}
      value={value || ''}
      onChange={onChange}
      onInput={(e) => setSearch(e.currentTarget.value)}
      data={options}
      placeholder='Search for a user...'
      {...props}
    />
  );
});
