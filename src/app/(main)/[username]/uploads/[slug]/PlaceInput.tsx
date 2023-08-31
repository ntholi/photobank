import { Input } from '@nextui-org/input';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import React, { useRef } from 'react';
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

export default function PlaceInput({ setLocation }: Props) {
  const inputRef = useRef<any>();

  const handlePlaceChanged = () => {
    if (!inputRef.current) return;
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setLocation({
        name: place.name as string,
        lat: place.geometry?.location.lat() as number,
        lng: place.geometry?.location.lng() as number,
      });
    }
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
        <Input label="Location" type="text" variant="bordered" placeholder="" />
      </StandaloneSearchBox>
    </LoadScript>
  );
}
