'use client';

import { Form } from '@/components/adease';
import { Autocomplete, Stack } from '@mantine/core';
import { Location, LocationDetails } from '@prisma/client';
import { useEffect, useState } from 'react';
import { getLocationDetailsWithoutTour } from './actions';
import TourInput from './TourInput';

type LocationDetailsWithLocation = LocationDetails & {
  location: Location;
};

type Props = {
  onSubmit: (values: {
    locationDetailsId: string;
    tourUrl: string;
    locationName?: string;
  }) => Promise<any>;
  defaultValues?: {
    locationDetailsId?: string;
    tourUrl?: string;
    locationName?: string;
  };
  title?: string;
};

export default function VirtualTourForm({
  onSubmit,
  defaultValues,
  title,
}: Props) {
  const [locations, setLocations] = useState<LocationDetailsWithLocation[]>([]);
  const [locationNames, setLocationNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const result = await getLocationDetailsWithoutTour();
      setLocations(result as LocationDetailsWithLocation[]);
      setLocationNames(result.map((it) => it.location.name));
    };
    fetchLocations();
  }, []);

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['location-details']}
      defaultValues={defaultValues}
    >
      {(form) => (
        <Stack>
          <Autocomplete
            label='Location'
            data={locationNames}
            value={form.values.locationName || ''}
            onChange={(value) => {
              const location = locations.find((l) => l.location.name === value);
              if (location) {
                form.setFieldValue('locationDetailsId', location.id);
                form.setFieldValue('locationName', value);
              }
            }}
          />
          <TourInput
            disabled={!form.values.locationDetailsId}
            {...form.getInputProps('tourUrl')}
          />
        </Stack>
      )}
    </Form>
  );
}
