'use client';

import { Form } from '@/components/adease';
import { Stack, Autocomplete } from '@mantine/core';
import { useEffect, useState } from 'react';
import { LocationDetails } from '@prisma/client';
import TourInput from '../location-details/TourInput';
import { getAllLocationDetails } from '../location-details/actions';

type Props = {
  onSubmit: (values: {
    locationDetailsId: string;
    tourUrl: string;
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
  const [locations, setLocations] = useState<LocationDetails[]>([]);
  const [locationNames, setLocationNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const result = await getAllLocationDetails();
      setLocations(result.items);
      setLocationNames(result.items.map((it) => it.location.name));
    };
    fetchLocations();
  }, []);

  return (
    <Form
      title={title}
      action={onSubmit}
      queryKey={['virtual-tours']}
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
          {form.values.locationDetailsId && (
            <TourInput {...form.getInputProps('tourUrl')} />
          )}
        </Stack>
      )}
    </Form>
  );
}
