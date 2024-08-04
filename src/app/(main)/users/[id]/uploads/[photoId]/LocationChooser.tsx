import { useEffect, useRef, useState } from 'react';
import { MapLocation } from './MapLocation';
import { Button, Input, Skeleton } from '@nextui-org/react';
import LocationPing from './LocationPing';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

type Props = {
  location: MapLocation | null;
  setLocation: React.Dispatch<React.SetStateAction<MapLocation | null>>;
};

const bounds = {
  north: -28.572872,
  south: -30.668418,
  east: 29.465229,
  west: 27.011223,
};

export default function LocationChooser({ location, setLocation }: Props) {
  const inputRef = useRef<any>();
  const [inputValue, setInputValue] = useState('');

  const handlePlaceChanged = () => {
    if (!inputRef.current) return;
    const [place] = inputRef.current.getPlaces();
    if (place) {
      console.log(place);
      console.log(place.geometry?.location.lat());
      // setLocation({
      //   display_name: place.name as string,
      //   lat: place.geometry?.location.lat() as number,
      //   lon: place.geometry?.location.lng() as number,
      // });
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
      <div className="flex items-center gap-1">
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
        <LocationPing setLocation={setLocation} />
      </div>
    </LoadScript>
  );
}
