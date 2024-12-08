import { TextInput, Box, Group } from '@mantine/core';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { Location } from '@prisma/client';
import { LOCATION_BOUNDS } from '@/lib/constants';

interface GooglePlace extends google.maps.places.PlaceResult {}

type Props = {
  value?: Location | null;
  onChange?: (location: Location | null) => void;
  disabled?: boolean;
  error?: React.ReactNode;
};

export default function LocationInput({
  value,
  onChange,
  disabled,
  error,
}: Props) {
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value) {
      setInputValue(value.name || '');
    }
  }, [value]);

  const handlePlaceChanged = () => {
    const searchBox = inputRef.current;
    if (!searchBox) return;

    const places: GooglePlace[] | undefined = searchBox.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const latitude = place.geometry?.location?.lat();
      const longitude = place.geometry?.location?.lng();
      const id = place.place_id;
      const name = place.name;

      if (id && latitude && longitude && name) {
        onChange?.({
          id,
          name,
          latitude,
          longitude,
        });
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
    if (event.currentTarget.value === '') {
      onChange?.(null);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places']}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
        bounds={LOCATION_BOUNDS}
      >
        <Box>
          <Group align='flex-start' gap='xs'>
            <TextInput
              label='Location'
              value={inputValue}
              onChange={handleInputChange}
              style={{ flex: 1 }}
              disabled={disabled}
              error={error}
            />
          </Group>
        </Box>
      </StandaloneSearchBox>
    </LoadScript>
  );
}
