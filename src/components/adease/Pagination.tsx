'use client';
import {
  Group,
  Pagination as MPagination,
  PaginationProps as MPaginationProps,
  Stack,
  Text,
} from '@mantine/core';
import { parseAsInteger, useQueryState } from 'nuqs';

export interface PaginationProps extends MPaginationProps {
  total: number;
  totalItems?: number;
}

export function Pagination({
  total: totalPages,
  totalItems,
  ...props
}: PaginationProps) {
  const [page, setPage] = useQueryState('page', parseAsInteger);

  return (
    <Stack gap={'xs'} p={'xs'}>
      {totalPages > 0 ? (
        <MPagination
          size='xs'
          total={totalPages}
          value={page || undefined}
          onChange={(newPage) => setPage(newPage)}
          siblings={1}
          {...props}
        />
      ) : (
        <Text size='xs' c='dimmed' ta='center'>
          No records
        </Text>
      )}

      {totalItems !== undefined && (
        <Group justify='center'>
          <Text size='xs' c='dimmed'>
            {totalItems?.toLocaleString()}
            {totalItems === 1 ? ' Record' : ' Records'}
          </Text>
        </Group>
      )}
    </Stack>
  );
}
