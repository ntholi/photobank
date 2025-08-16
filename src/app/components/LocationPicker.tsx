'use client';

import { Autocomplete, AutocompleteProps, Loader } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import {
  getPlaceDetails,
  searchPlaces,
  upsertLocationByPlaceId,
} from '@/server/locations/actions';

type LocationState = 'idle' | 'searching' | 'selecting' | 'valid' | 'invalid';

type Props = Omit<AutocompleteProps, 'data' | 'onOptionSubmit' | 'onSelect'> & {
  value?: string | null;
  onChange?: (value: string) => void;
  onLocationSelect?: (selected: {
    id: string;
    name: string;
    formattedAddress?: string | null;
  }) => void;
  required?: boolean;
};

export default function LocationPicker({
  value,
  onChange,
  onLocationSelect,
  required = false,
  ...rest
}: Props) {
  const [input, setInput] = useState(value ?? '');
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<LocationState>('idle');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const isSelectingRef = useRef<boolean>(false);

  useEffect(() => {
    setInput(value ?? '');
  }, [value]);

  useEffect(() => {
    const trimmed = input.trim();
    if (selected) {
      setState('valid');
      return;
    }
    if (trimmed.length === 0) {
      setState(required ? 'invalid' : 'idle');
      return;
    }
    setState('invalid');
  }, [input, selected, selectedLabel, required]);

  const { data: suggestions, isLoading: isSearching } = useQuery({
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

  const getRightSectionIcon = () => {
    if (isSearching || getDetails.isPending || upsert.isPending) {
      return <Loader size='sm' />;
    }
    if (state === 'valid') {
      return <IconCheck size={20} color='green' />;
    }
    if (state === 'invalid') {
      return <IconAlertCircle size={20} color='red' />;
    }
    return null;
  };

  return (
    <Autocomplete
      value={input}
      data={data}
      rightSection={getRightSectionIcon()}
      rightSectionWidth={40}
      onChange={(v) => {
        setInput(v);
        if (isSelectingRef.current) {
          isSelectingRef.current = false;
        } else if (v.trim().length === 0) {
          setSelected(null);
          setSelectedLabel(null);
        }
        onChange?.(v);
      }}
      onOptionSubmit={async (description) => {
        const match = (suggestions ?? []).find(
          (o) => o.description === description
        );
        if (!match) return;

        isSelectingRef.current = true;
        setInput(description);
        setSelected(match.placeId);
        setSelectedLabel(description);

        try {
          const details = await getDetails.mutateAsync(match.placeId);
          const saved = await upsert.mutateAsync(details);
          onLocationSelect?.({
            id: saved.id,
            name: saved.name,
            formattedAddress: saved.formattedAddress ?? null,
          });
        } catch (error) {
          setSelected(null);
          setSelectedLabel(null);
          console.error('Error selecting location:', error);
        }
      }}
      {...rest}
      description={selectedLabel ?? undefined}
    />
  );
}
