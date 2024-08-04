import { Input } from '@nextui-org/react';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { useRef, useState } from 'react';
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

  const handlePlaceChanged = () => {
    const searchBox = inputRef.current;
    if (!searchBox) return;

    const places: GooglePlace[] | undefined = searchBox.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const latitude = place.geometry?.location?.lat();
      const longitude = place.geometry?.location?.lng();
      const id = place.place_id;
      console.log('Place', place);
      if (id && latitude && longitude) {
        setLocation({ id, name: place.name, latitude, longitude });
      }
      setInputValue(place.name || 'Unnamed Location');
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
        {/* <LocationPing setLocation={setLocation} /> */}
      </div>
    </LoadScript>
  );
}
