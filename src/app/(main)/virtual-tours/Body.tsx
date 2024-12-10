'use client';

import { useQuery } from '@tanstack/react-query';
import { getLocationDetails } from './actions';
import { VirtualTourCard } from './Card';

export default function Body() {
  const { data } = useQuery({
    queryKey: ['location-details'],
    queryFn: getLocationDetails,
  });
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      {data?.map((location) => (
        <VirtualTourCard key={location.id} location={location} />
      ))}
    </div>
  );
}
