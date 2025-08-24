import { getTopLocationsByContentCount } from '@/server/locations/actions';
import { Card, CardBody } from '@heroui/card';
import MapView from './MapView';

export default async function MapPage() {
  const points = await getTopLocationsByContentCount(20);
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10'>
      <div className='mb-6'>
        <h1 className='text-xl font-semibold tracking-tight md:text-4xl'>
          Explore Lesotho
        </h1>
        <p className='text-default-500 mt-2 text-xs md:text-base'>
          Top locations by content volume across the kingdom.
        </p>
      </div>
      <Card radius='lg' shadow='sm' className='border-default-200/60 border'>
        <CardBody className='p-0'>
          <MapView points={points} />
        </CardBody>
      </Card>
    </div>
  );
}
