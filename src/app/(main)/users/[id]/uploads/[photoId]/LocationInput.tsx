import React, { useRef, useState } from 'react';
import { Input } from '@nextui-org/react';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { Location } from '@/lib/types';

type Props = {
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
};

const bounds = {
  north: -28.572872,
  south: -30.668418,
  east: 29.465229,
  west: 27.011223,
};

export default function LocationInput({ setLocation }: Props) {
  const inputRef = useRef<any>();
  const [inputValue, setInputValue] = useState('');

  const handlePlaceChanged = () => {
    if (!inputRef.current) return;
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setLocation({
        name: place.name as string,
        lat: place.geometry?.location.lat() as number,
        lng: place.geometry?.location.lng() as number,
      });
      setInputValue(place.name as string);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''}
      libraries={['places']}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
        bounds={bounds}
      >
        <Input
          label="Location"
          type="text"
          variant="bordered"
          placeholder=""
          description="Where was the photo taken?"
          value={inputValue}
          onChange={handleInputChange}
        />
      </StandaloneSearchBox>
    </LoadScript>
  );
}
