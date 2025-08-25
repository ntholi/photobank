'use client';

import React from 'react';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPlaceDetails, searchPlaces } from '@/server/locations/actions';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string | null;
  onChange?: (v: string) => void;
  onLocationSelect?: (selected: {
    placeId: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
  }) => void;
};

export default function LocationPicker({
  label,
  placeholder,
  value,
  onChange,
  onLocationSelect,
}: Props) {
  const [input, setInput] = React.useState(value ?? '');
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => setInput(value ?? ''), [value]);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['places', input],
    queryFn: async () => (input.trim() ? await searchPlaces(input.trim()) : []),
    enabled: input.trim().length > 0,
    staleTime: 60_000,
  });

  const getDetails = useMutation({ mutationFn: getPlaceDetails });

  const items = (suggestions ?? []).map((s) => ({
    key: s.placeId,
    label: s.description,
  }));

  return (
    <Autocomplete
      label={label}
      aria-label='Location'
      placeholder={placeholder}
      inputValue={input}
      onInputChange={(v) => {
        setInput(v);
        if (v.trim().length === 0) setSelected(null);
        onChange?.(v);
      }}
      selectedKey={selected ?? undefined}
      onSelectionChange={async (key) => {
        const k = key?.toString();
        if (!k) return;
        const match = (suggestions ?? []).find((s) => s.placeId === k);
        if (!match) return;
        setSelected(k);
        setInput(match.description);
        try {
          const details = await getDetails.mutateAsync(k);
          onLocationSelect?.(details);
        } catch {}
      }}
      className='w-full'
      items={items}
      isLoading={isLoading || getDetails.isPending}
    >
      {(item) => (
        <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
}
