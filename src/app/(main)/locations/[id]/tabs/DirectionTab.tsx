'use client';
import Link from 'next/link';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MdDirections } from 'react-icons/md';
import { locations, content as contentSchema } from '@/db/schema';

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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

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
      <div className='border-default-200 bg-default-100 aspect-[18/9] w-full overflow-hidden rounded-lg border'>
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={15}
            center={defaultCenter}
          >
            <Marker position={defaultCenter} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
