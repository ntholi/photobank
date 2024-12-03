'use client';

import {
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  ScrollArea,
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListItem } from './ListItem';
import { Pagination } from './Pagination';
import { SearchField } from './SearchField';

export type ListLayoutProps<T> = {
  getItems: (
    page: number,
    search: string
  ) => Promise<{ items: T[]; pages: number }>;
  renderItem: (item: T) => React.ReactNode;
  path: string;
  queryKey: string[];
  actionIcons?: React.ReactNode[];
  children: React.ReactNode;
};

export function ListLayout<T>({
  getItems,
  renderItem,
  actionIcons,
  children,
  queryKey,
  path,
}: ListLayoutProps<T>) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  const { data = { items: [], pages: 0 } } = useQuery({
    queryKey: [...queryKey, page, search],
    queryFn: () => getItems(page, search),
    staleTime: 0,
  });

  const { items, pages } = data;

  const renderListItem = (item: T) => {
    const itemElement = renderItem(item);
    if (React.isValidElement(itemElement) && itemElement.type === ListItem) {
      return React.cloneElement(
        itemElement as React.ReactElement<
          React.ComponentProps<typeof ListItem>
        >,
        { path }
      );
    }
    return itemElement;
  };

  return (
    <Grid columns={14} gutter={'xl'}>
      <GridCol span={4} pr={7}>
        <Paper withBorder h={'88vh'}>
          <Flex direction='column' h='100%'>
            <Flex p={'md'} justify='space-between' align={'center'} gap={'xs'}>
              <Group style={{ width: '100%', flex: 1 }}>
                <SearchField style={{ width: '100%' }} />
              </Group>
              {actionIcons?.map((component, index) => (
                <React.Fragment key={index}>{component}</React.Fragment>
              ))}
            </Flex>
            <Divider />
            <ScrollArea type='always' style={{ flex: 1 }} p={'sm'}>
              {items.map((item: T, index: number) => (
                <React.Fragment key={index}>
                  {renderListItem(item)}
                </React.Fragment>
              ))}
            </ScrollArea>

            <Divider />
            <Pagination total={pages} />
          </Flex>
        </Paper>
      </GridCol>

      <GridCol span={10}>
        <Paper withBorder>
          <ScrollArea h='88vh' type='always'>
            {children}
          </ScrollArea>
        </Paper>
      </GridCol>
    </Grid>
  );
}
