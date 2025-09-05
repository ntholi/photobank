'use client';
import { Pagination } from '@heroui/pagination';
import { useQueryState, parseAsInteger } from 'nuqs';

export default function ToursPagination({
  totalPages,
  page,
}: {
  totalPages: number;
  page: number;
}) {
  const [curPage, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(page),
  );

  if (totalPages <= 1) return null;

  return (
    <Pagination
      page={curPage}
      total={totalPages}
      onChange={setPage}
      showControls
      initialPage={page}
      size='sm'
      radius='sm'
      variant='flat'
      classNames={{ cursor: 'bg-primary text-primary-foreground' }}
    />
  );
}
