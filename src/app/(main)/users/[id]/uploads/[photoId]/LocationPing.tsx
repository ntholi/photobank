import React, { useState } from 'react';
import { getLocation } from './utils';
import { Button } from '@nextui-org/react';
import { MdLocationOn } from 'react-icons/md';
import { Location } from './LocationInput';

type Props = {
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
};

export default function LocationPing({ setLocation }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  function pingLocation() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Coordinates', position.coords);
        getLocation(position)
          .then((data) => {
            console.log(data);
            setLocation(data);
          })
          .catch(console.error)
          .finally(() => {
            setLoading(false);
          });
      },
      (error) => {
        console.log(error);
        setLoading(false);
      },
      { timeout: 1000 * 10, enableHighAccuracy: true },
    );
  }

  return (
    <Button
      isIconOnly
      radius="full"
      variant="bordered"
      className="h-14 w-16"
      aria-label="Pick Location"
      onClick={pingLocation}
      isLoading={loading}
    >
      <MdLocationOn className="text-2xl text-gray-600" />
    </Button>
  );
}
