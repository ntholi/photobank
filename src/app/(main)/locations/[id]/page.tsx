import { getLocationWithCover } from '@/server/locations/actions';
import { notFound } from 'next/navigation';
import { LocationContentGrid } from './LocationContentGrid';
import { LocationHero } from './LocationHero';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LocationPage({ params }: Props) {
  const { id } = await params;
  const data = await getLocationWithCover(id);
  if (!data) {
    notFound();
  }

  return (
    <div className='min-h-screen'>
      <LocationHero location={data} />
      <LocationContentGrid content={data.content} locationName={data.name} />
    </div>
  );
}
