import { Input } from '@nextui-org/react';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import LocationPing from './LocationPing';

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

export type Location = {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
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

      if (id && latitude && longitude) {
        setLocation({ id, name: place.name, latitude, longitude });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
        <div className="flex items-start gap-1">
          <Input
            label="Location"
            type="text"
            variant="bordered"
            placeholder=""
            description="Where was the photo taken?"
            value={inputValue}
            onChange={handleInputChange}
          />
          <LocationPing setLocation={setLocation} />
        </div>
      </StandaloneSearchBox>
    </LoadScript>
  );
}
