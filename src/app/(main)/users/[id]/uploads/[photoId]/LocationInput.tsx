import React, { useEffect, useState, useCallback } from 'react';
import { Input } from '@nextui-org/react';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import LocationPing from './LocationPing';
import { LOCATION_BOUNDS } from '@/lib/constants';
import { Location } from '@prisma/client';

type Props = {
  location?: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location | undefined>>;
};

interface GooglePlace extends google.maps.places.PlaceResult {}

// Define libraries array outside of the component
const libraries: 'places'[] = ['places'];

const LocationInput: React.FC<Props> = ({ location, setLocation }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries, // Use the constant libraries array
  });

  useEffect(() => {
    if (location) {
      setInputValue(location.name);
    }
  }, [location]);

  const handlePlaceChanged = useCallback(() => {
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
  }, [searchBox, setLocation]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  }, []);

  if (!isLoaded) return null;

  return (
    <StandaloneSearchBox
      onLoad={onLoad}
      onPlacesChanged={handlePlaceChanged}
      bounds={LOCATION_BOUNDS}
    >
      <div className='flex items-start gap-1'>
        <Input
          label='Location'
          type='text'
          variant='bordered'
          placeholder=''
          description='Where was the photo taken?'
          value={inputValue}
          onChange={handleInputChange}
        />
        <LocationPing setLocation={setLocation} />
      </div>
    </StandaloneSearchBox>
  );
};

export default React.memo(LocationInput);
