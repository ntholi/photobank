'use client';

import { useViewSelect } from '@/hooks/useViewSelect';
import {
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'nextjs-toploader/app';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { ListItem } from './ListItem';
import { Pagination } from './Pagination';
import { SearchField } from './SearchField';

export type ListLayoutProps<T> = {
  getData: (
    page: number,
    search: string
  ) => Promise<{ items: T[]; totalPages: number; totalItems?: number }>;
  renderItem: (item: T) => React.ReactNode;
  path: string;
  queryKey: string[];
  actionIcons?: React.ReactNode[];
  children: React.ReactNode;
};

export function ListLayout<T>({
  getData,
  renderItem,
  actionIcons,
  children,
  queryKey,
  path,
}: ListLayoutProps<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [view, setView] = useViewSelect();

  const {
    isLoading,
    data: { items, totalPages, totalItems } = {
      items: [],
      totalPages: 0,
      totalItems: 0,
    },
  } = useQuery({
    queryKey: [...queryKey, page, search],
    queryFn: () => getData(page, search),
    staleTime: 0,
  });

  const renderListItem = (item: T) => {
    const itemElement = renderItem(item);
    if (React.isValidElement(itemElement) && itemElement.type === ListItem) {
      return React.cloneElement(
        itemElement as React.ReactElement<
          React.ComponentProps<typeof ListItem>
        >,
        {
          path,
          onClick: async () => {
            if (isMobile) {
              await setView('details');
            }
            const itemId = (itemElement.props as { id: string }).id;
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('view', 'details');
            const url = `${path}/${itemId}?${newSearchParams.toString()}`;
            router.push(url);
          },
        }
      );
    }
    return itemElement;
  };

  if (isMobile && view === 'details') {
    return (
      <Paper withBorder>
        <ScrollArea h='88vh' type='always'>
          {children}
        </ScrollArea>
      </Paper>
    );
  }

  return (
    <Grid columns={14} gutter={{ base: 'xs', sm: 'sm', md: 'md' }}>
      <GridCol span={isMobile ? 14 : 4} pb={0}>
        <Paper withBorder h='88vh'>
          <Flex direction='column' h='100%'>
            <Stack p='md' gap='sm'>
              <Flex justify='space-between' align='center' gap='md'>
                <Group style={{ width: '100%', flex: 1 }}>
                  <SearchField style={{ width: '100%' }} />
                </Group>
                {actionIcons?.map((component, index) => (
                  <React.Fragment key={`action-${index}`}>
                    {component}
                  </React.Fragment>
                ))}
              </Flex>
            </Stack>

            <Divider />

            <ScrollArea type='always' style={{ flex: 1 }} p='md'>
              {isLoading ? (
                <Stack gap='sm'>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton height={35} key={`skeleton-${index}`} />
                  ))}
                </Stack>
              ) : (
                <Stack gap={3}>
                  {items.map((item: T, index: number) => (
                    <React.Fragment key={`item-${index}`}>
                      {renderListItem(item)}
                    </React.Fragment>
                  ))}
                </Stack>
              )}
            </ScrollArea>

            <Divider />

            <Pagination total={totalPages} totalItems={totalItems} />
          </Flex>
        </Paper>
      </GridCol>

      {!isMobile && (
        <GridCol span={10} pb={0} pr={5}>
          <Paper withBorder>
            <ScrollArea h='88vh' type='always'>
              {children}
            </ScrollArea>
          </Paper>
        </GridCol>
      )}
    </Grid>
  );
}
