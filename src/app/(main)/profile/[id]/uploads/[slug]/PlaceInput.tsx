import { Input } from '@nextui-org/input';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import React, { useRef } from 'react';

export default function PlaceInput() {
  const inputRef = useRef();

  const handlePlaceChanged = () => {
    if (!inputRef.current) return;
    const [place] = inputRef.current.getPlaces();
    if (place) {
      console.log(place.formatted_address);
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
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
      >
        <Input label="Location" type="text" variant="bordered" />
      </StandaloneSearchBox>
    </LoadScript>
  );
}
