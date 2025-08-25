'use client';
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

export default function VirtualTourTab({ location }: Props) {
  if (!location.virtualTourUrl) return null;

  return (
    <div className='w-full'>
      <div className='border-default-200 bg-default-100 aspect-[17/9] w-full overflow-hidden rounded-lg border'>
        <iframe
          title={`${location.name} virtual tour`}
          src={location.virtualTourUrl}
          allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking'
          allowFullScreen
          loading='lazy'
          className='h-full w-full'
        />
      </div>
    </div>
  );
}
