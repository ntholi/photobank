import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { VirtualTourCard } from './components/virtual-tour-card';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Virtual Tours | Photobank',
  description: 'Explore our collection of immersive virtual tours',
};

async function getLocationsWithTours() {
  return await prisma.locationDetails.findMany({
    where: {
      NOT: {
        tourUrl: null,
      },
    },
    include: {
      location: true,
      coverPhoto: true,
    },
    orderBy: {
      location: {
        name: 'asc',
      },
    },
  });
}

export default async function VirtualToursPage() {
  const locationsWithTours = await getLocationsWithTours();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Virtual Tours</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Explore stunning locations through our immersive virtual tours
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {locationsWithTours.map((location) => (
          <VirtualTourCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
