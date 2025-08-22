'use client';

import { useQuery } from '@tanstack/react-query';
import { getFilteredContent } from '@/server/content/actions';
import { content } from '@/db/schema';
import {
  SimpleGrid,
  Card,
  Image,
  AspectRatio,
  Stack,
  Text,
  Group,
  Center,
  Skeleton,
  Badge,
  Box,
} from '@mantine/core';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

type ContentItem = typeof content.$inferSelect;

type Props = {
  locationId: string;
};

function LoadingSkeleton() {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing='md'>
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} padding={0} radius='md' withBorder>
          <AspectRatio ratio={1}>
            <Skeleton height='100%' />
          </AspectRatio>
          <Box p='xs'>
            <Skeleton height={12} width='80%' />
          </Box>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default function LocationContent({ locationId }: Props) {
  const { data, isLoading } = useQuery<{
    items: ContentItem[];
    totalPages: number;
    totalItems: number;
  }>({
    queryKey: ['location-content', locationId],
    queryFn: () => getFilteredContent({ page: 1, size: 20, locationId }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const items = data?.items || [];

  if (items.length === 0) {
    return (
      <Center>
        <Text size='sm' c='dimmed'>
          No content found for this location
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Text size='sm' fw={500}>
          Content
        </Text>
        <Badge variant='default' size='sm' radius='xl'>
          {data?.totalItems || 0}
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing='md'>
        {items.map((item) => (
          <Card
            key={item.id}
            component={Link}
            href={`/dashboard/content/${item.id}`}
            padding={0}
            radius='md'
            withBorder
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            <AspectRatio ratio={1}>
              <Image
                src={getImageUrl(item.thumbnailKey || item.s3Key)}
                alt={item.fileName || 'Content'}
                fit='cover'
              />
            </AspectRatio>
            {item.fileName && (
              <Box p='xs'>
                <Text size='xs' truncate fw={500}>
                  {item.fileName}
                </Text>
              </Box>
            )}
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
