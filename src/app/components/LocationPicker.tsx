'use client';

import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getPlaceDetails,
  searchPlaces,
  upsertLocationByPlaceId,
} from '@/server/locations/actions';

type Suggestion = {
  description: string;
  placeId: string;
};

type Props = Omit<AutocompleteProps, 'data' | 'onOptionSubmit' | 'onSelect'> & {
  value?: string | null;
  onChange?: (value: string) => void;
  onLocationSelect?: (selected: {
    id: string;
    name: string;
    formattedAddress?: string | null;
  }) => void;
};

export default function LocationPicker({
  value,
  onChange,
  onLocationSelect,
  ...rest
}: Props) {
  const [input, setInput] = useState(value ?? '');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setInput(value ?? '');
  }, [value]);

  const { data: suggestions } = useQuery({
    queryKey: ['places', input],
    queryFn: async () => (input.trim() ? await searchPlaces(input.trim()) : []),
    enabled: input.trim().length > 0,
    staleTime: 60_000,
  });

  const data = useMemo(
    () =>
      (suggestions ?? []).map((s) => ({
        value: s.description,
        label: s.description,
      })),
    [suggestions]
  );

  const getDetails = useMutation({ mutationFn: getPlaceDetails });
  const upsert = useMutation({ mutationFn: upsertLocationByPlaceId });

  return (
    <Autocomplete
      value={input}
      data={data}
      onChange={(v) => {
        setInput(v);
        setSelected(null);
        onChange?.(v);
      }}
      onOptionSubmit={async (description) => {
        const match = (suggestions ?? []).find(
          (o) => o.description === description
        );
        if (!match) return;
        setInput(description);
        setSelected(match.placeId);
        const details = await getDetails.mutateAsync(match.placeId);
        const saved = await upsert.mutateAsync(details);
        onLocationSelect?.({
          id: saved.id,
          name: saved.name,
          formattedAddress: saved.formattedAddress ?? null,
        });
      }}
      {...rest}
    />
  );
}
