'use client';
import { content as contentSchema, locations } from '@/db/schema';
import { GoogleMap, Marker } from '@react-google-maps/api';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

type Props = {
  location: Location & {
    coverContent: Content | null;
    about: string | null;
    virtualTourUrl?: string | null;
  };
};

export default function DirectionTab({ location }: Props) {
  const mapStyles = {
    height: '100%',
    width: '100%',
  };

  const defaultCenter = {
    lat: location.latitude,
    lng: location.longitude,
  };

  const mapsUrl = location.placeId
    ? `https://www.google.com/maps/dir/?api=1&destination_place_id=${encodeURIComponent(location.placeId)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.latitude},${location.longitude}`)}`;

  return (
    <div className='space-y-6'>
      <div className='border-default-200 bg-default-100 aspect-[17/9] w-full overflow-hidden rounded-lg border'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={15}
          center={defaultCenter}
        >
          <Marker position={defaultCenter} />
        </GoogleMap>
      </div>
    </div>
  );
}
