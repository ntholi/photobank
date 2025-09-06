import { getTopLocationsByContentCount } from '@/server/locations/actions';
import { Button, ButtonGroup } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import Link from 'next/link';
import MapView from './MapView';
import { createLoader, parseAsInteger, type SearchParams } from 'nuqs/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Locations',
  description:
    'Discover beautiful locations across Lesotho with interactive map and photo collections.',
};

const loadSearchParams = createLoader({
  limit: parseAsInteger.withDefault(20),
});

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function MapPage({ searchParams }: Props) {
  const { limit } = await loadSearchParams(searchParams);
  const points = await getTopLocationsByContentCount(limit);
  const options = [10, 20, 50, 100];

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10'>
      <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight md:text-4xl'>
            Explore Lesotho
          </h1>
          <p className='text-default-500 mt-2 text-xs md:text-base'>
            Showing top {limit} locations by content volume across the kingdom.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <ButtonGroup variant='flat'>
            {options.map((n) => (
              <Button
                as={Link}
                href={n === 20 ? '/locations' : `/locations?limit=${n}`}
                key={n}
                color={n === limit ? 'primary' : 'default'}
                variant={n === limit ? 'solid' : 'flat'}
                size='sm'
              >
                Top {n}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <Card radius='lg' shadow='sm' className='border-default-200/60 border'>
        <CardBody className='relative p-0'>
          {points.length === 0 ? (
            <div className='flex h-[50vh] w-full items-center justify-center'>
              <div className='text-center'>
                <p className='text-default-500'>No locations to display yet.</p>
              </div>
            </div>
          ) : (
            <>
              <MapView points={points} />
              <div className='rounded-medium bg-background/80 ring-default-200/60 pointer-events-none absolute bottom-3 left-3 hidden p-2 shadow-sm ring-1 backdrop-blur-md md:flex'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <span className='bg-primary inline-block h-2 w-2 rounded-full' />
                    <span className='text-foreground-500 text-xs'>
                      Fewer posts
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='bg-primary inline-block h-3 w-3 rounded-full' />
                    <span className='text-foreground-500 text-xs'>
                      More posts
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
