import React, { useState } from 'react';
import { getLocation } from './utils';
import { Button } from '@nextui-org/react';
import { MdLocationOn } from 'react-icons/md';
import { Location } from '@prisma/client';

type Props = {
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
};

export default function LocationPing({ setLocation }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  function pingLocation() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getLocation(position)
          .then((data) => {
            if (data.id && data.latitude && data.longitude && data.name) {
              setLocation({
                id: data.id,
                latitude: data.latitude,
                longitude: data.longitude,
                name: data.name,
              });
            }
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
