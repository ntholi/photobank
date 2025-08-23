import React from 'react';
import { notFound } from 'next/navigation';
import { getLocationWithContent } from '@/server/locations/actions';
import { LocationHero } from './LocationHero';
import { LocationContentGrid } from './LocationContentGrid';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LocationPage({ params }: Props) {
  const { id } = await params;
  const locationData = await getLocationWithContent(id);
  if (!locationData) {
    notFound();
  }

  return (
    <div className='min-h-screen'>
      <LocationHero location={locationData} />
      <LocationContentGrid
        content={locationData.content}
        locationName={locationData.name}
      />
    </div>
  );
}
