import { getTopLocationsByContentCount } from '@/server/locations/actions';
import MapView from './MapView';

export default async function MapPage() {
  const points = await getTopLocationsByContentCount(20);
  return (
    <div className='flex min-h-[70vh] items-center justify-center px-4'>
      <MapView points={points} />
    </div>
  );
}
