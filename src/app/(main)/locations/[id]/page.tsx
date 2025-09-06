import { getLocationWithCover } from '@/server/locations/actions';
import { notFound } from 'next/navigation';
import { LocationContentGrid } from './LocationContentGrid';
import { LocationHero } from './LocationHero';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const location = await getLocationWithCover(id);
    if (!location) {
      return {
        title: 'Location not found',
        robots: { index: false, follow: false },
      };
    }

    const title = `${location.name} - Lesotho`;
    const description = `Explore ${location.name} in Lesotho. View photos and content from this beautiful location.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
      },
    };
  } catch {
    return { title: siteConfig.name };
  }
}

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
