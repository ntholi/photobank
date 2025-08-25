'use client';
import Link from 'next/link';
import { MdDirections, MdLocationOn } from 'react-icons/md';
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
  const mapsUrl = location.placeId
    ? `https://www.google.com/maps/dir/?api=1&destination_place_id=${encodeURIComponent(location.placeId)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.latitude},${location.longitude}`)}`;

  return (
    <div className='space-y-4'>
      <div className='flex items-start gap-3'>
        <MdLocationOn className='mt-1 h-5 w-5 text-gray-500' />
        <div>
          <div className='text-lg text-gray-800'>Destination</div>
          <div className='text-gray-700'>
            {location.address ?? `${location.latitude}, ${location.longitude}`}
          </div>
        </div>
      </div>
      <div>
        <Link
          href={mapsUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-foreground text-foreground-50 inline-flex items-center gap-2 rounded-md px-4 py-2 hover:opacity-90'
        >
          <MdDirections size={18} />
          <span>Open directions in Google Maps</span>
        </Link>
      </div>
    </div>
  );
}
