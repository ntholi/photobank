import { TextInput, Box, Group } from '@mantine/core';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { Location } from '@prisma/client';

type Props = {
  location: Location | null;
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
};

const bounds = {
  north: -28.572872,
  south: -30.668418,
  east: 29.465229,
  west: 27.011223,
};

interface GooglePlace extends google.maps.places.PlaceResult {}

export default function LocationChooser({ location, setLocation }: Props) {
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (location) {
      setInputValue(location.name || '');
    }
  }, [location]);

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
        setLocation({ id, name, latitude, longitude });
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places']}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
        bounds={bounds}
      >
        <Box>
          <Group align="flex-start" gap="xs">
            <TextInput
              label="Location"
              value={inputValue}
              onChange={handleInputChange}
              style={{ flex: 1 }}
            />
          </Group>
        </Box>
      </StandaloneSearchBox>
    </LoadScript>
  );
}
