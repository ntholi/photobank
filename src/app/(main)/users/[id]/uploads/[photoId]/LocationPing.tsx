import React, { useState } from 'react';
import { MapLocation } from './MapLocation';
import { getLocation } from './utils';
import { Button } from '@nextui-org/react';
import { MdLocationOn } from 'react-icons/md';

type Props = {
  setLocation: React.Dispatch<React.SetStateAction<MapLocation | null>>;
};

export default function LocationPing({ setLocation }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  function pingLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getLocation(position)
          .then((data) => {
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
      variant="bordered"
      className="h-12 w-14"
      aria-label="Pick Location"
      onClick={pingLocation}
      isLoading={loading}
    >
      <MdLocationOn className="text-2xl text-gray-600" />
    </Button>
  );
}
