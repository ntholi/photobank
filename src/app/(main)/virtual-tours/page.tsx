import { getVirtualTours } from '@/server/virtual-tours/actions';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Suspense } from 'react';
import TourCard from '@/app/(main)/virtual-tours/TourCard';
import SearchBar from '@/app/(main)/virtual-tours/SearchBar';
import ToursPagination from '@/app/(main)/virtual-tours/ToursPagination';
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  type SearchParams,
} from 'nuqs/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Tours',
  description:
    'Explore immersive 360° virtual tours across Lesotho. Experience the beauty of the kingdom from anywhere.',
};

const loadSearchParams = createLoader({
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(''),
});

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function VirtualToursPage({ searchParams }: Props) {
  const { page, q } = await loadSearchParams(searchParams);
  const { items, totalPages, totalItems } = await getVirtualTours(page, q);

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10'>
      <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight md:text-4xl'>
            Virtual Tours
          </h1>
          <p className='text-default-500 mt-2 text-xs md:text-base'>
            Explore immersive 360° experiences across Lesotho.
          </p>
        </div>
        <div className='w-full md:w-[360px]'>
          <Suspense>
            <SearchBar initialQuery={q} />
          </Suspense>
        </div>
      </div>

      {items.length === 0 ? (
        <Card radius='lg' shadow='sm' className='border-default-200/60 border'>
          <CardBody className='flex min-h-[40vh] items-center justify-center'>
            <div className='text-center'>
              <p className='text-default-500'>No virtual tours found.</p>
              {q ? (
                <p className='text-default-400 mt-1 text-sm'>
                  Try adjusting your search.
                </p>
              ) : (
                <p className='text-default-400 mt-1 text-sm'>
                  Check back later as new tours are added.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className='text-foreground-500 mb-3 text-xs'>
            Showing {items.length} of {totalItems} tours
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {items.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className='mt-8 flex w-full justify-center'>
              <ToursPagination totalPages={totalPages} page={page} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
