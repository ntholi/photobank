'use client';

import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLoadScript } from '@react-google-maps/api';
import { upsertLocationByPlaceId } from '@/server/locations/actions';

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

const libraries: 'places'[] = ['places'];

export default function LocationPicker({
  value,
  onChange,
  onLocationSelect,
  ...rest
}: Props) {
  const [input, setInput] = useState(value ?? '');
  const [predictions, setPredictions] = useState<Suggestion[]>([]);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    setInput(value ?? '');
  }, [value]);

  useEffect(() => {
    if (!isLoaded) return;
    const q = input.trim();
    if (q.length < 2) {
      setPredictions([]);
      return;
    }

    if (!sessionTokenRef.current) {
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    }

    const svc = new google.maps.places.AutocompleteService();
    svc.getPlacePredictions(
      { input: q, sessionToken: sessionTokenRef.current },
      (res: google.maps.places.AutocompletePrediction[] | null) => {
        const mapped = (res ?? []).map((p) => ({
          description: p.description ?? '',
          placeId: p.place_id ?? '',
        }));
        setPredictions(mapped.filter((p) => p.placeId && p.description));
      }
    );
  }, [input, isLoaded]);

  const data = useMemo(
    () =>
      predictions.map((s) => ({ value: s.description, label: s.description })),
    [predictions]
  );

  const upsert = useMutation({ mutationFn: upsertLocationByPlaceId });

  return (
    <Autocomplete
      disabled={!isLoaded}
      value={input}
      data={data}
      onChange={(v) => {
        setInput(v);
        onChange?.(v);
      }}
      onOptionSubmit={async (description) => {
        const match = predictions.find((o) => o.description === description);
        if (!match || !isLoaded) return;

        const detailsSvc = new google.maps.places.PlacesService(
          document.createElement('div')
        );
        await new Promise<void>((resolve) => {
          detailsSvc.getDetails(
            {
              placeId: match.placeId,
              fields: ['place_id', 'name', 'formatted_address'],
              sessionToken: sessionTokenRef.current || undefined,
            },
            async (place: google.maps.places.PlaceResult | null) => {
              if (place && place.place_id && place.name) {
                const saved = await upsert.mutateAsync({
                  placeId: place.place_id,
                  name: place.name,
                  formattedAddress: place.formatted_address ?? undefined,
                });
                onLocationSelect?.({
                  id: saved.id,
                  name: saved.name,
                  formattedAddress: saved.formattedAddress ?? null,
                });
              }
              sessionTokenRef.current = null;
              resolve();
            }
          );
        });
      }}
      {...rest}
    />
  );
}
