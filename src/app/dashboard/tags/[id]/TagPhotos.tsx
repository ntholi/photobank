'use client';

import {
  AspectRatio,
  Card,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Group,
  Badge,
  Skeleton,
  Box,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getContentByTag } from '@/server/content/actions';
import { getImageUrl } from '@/lib/utils';
import { IconPhoto } from '@tabler/icons-react';
import Link from 'next/link';

type TagContentResult = Awaited<ReturnType<typeof getContentByTag>>;
type ContentItem = TagContentResult['items'][number];

type Props = {
  tagId: string;
};

function PhotoCard({ item }: { item: ContentItem }) {
  const imageUrl = getImageUrl(item.thumbnailKey || item.s3Key);

  return (
    <Card
      component={Link}
      href={`/dashboard/content/${item.id}`}
      padding={0}
      radius='md'
      withBorder
      style={{
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      }}
    >
      <AspectRatio ratio={1}>
        <Image
          src={imageUrl}
          alt={item.fileName || 'Content'}
          fit='cover'
          fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
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
  );
}

function LoadingSkeleton() {
  return (
    <SimpleGrid
      cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
      spacing={{ base: 'sm', md: 'md' }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
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

export default function TagContent({ tagId }: Props) {
  const {
    data: contentResult,
    isLoading,
    error,
  } = useQuery<TagContentResult>({
    queryKey: ['tag-content', tagId],
    queryFn: () => getContentByTag(tagId, 1, 15),
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    return (
      <Stack gap='md'>
        <Group align='center' gap='xs'>
          <IconPhoto size={18} />
          <Title order={4} size='md'>
            Photos
          </Title>
        </Group>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='red'>
            Failed to load photos
          </Text>
        </Card>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack gap='md'>
        <Group align='center' gap='xs'>
          <IconPhoto size={18} />
          <Title order={4} size='md'>
            Photos
          </Title>
        </Group>
        <LoadingSkeleton />
      </Stack>
    );
  }

  const photos = contentResult?.items || [];

  if (photos.length === 0) {
    return (
      <Stack gap='md'>
        <Group align='center' gap='xs'>
          <IconPhoto size={18} />
          <Title order={4} size='md'>
            Photos
          </Title>
        </Group>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='dimmed' ta='center'>
            No photos found with this tag
          </Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Group align='center' gap='xs'>
          <IconPhoto size={18} />
          <Title order={4} size='md'>
            Photos
          </Title>
        </Group>
        <Badge variant='default' size='sm' radius='xl'>
          {contentResult?.totalItems || 0}{' '}
          {(contentResult?.totalItems || 0) === 1 ? 'photo' : 'photos'}
          {photos.length < (contentResult?.totalItems || 0)
            ? ` (showing first ${photos.length})`
            : ''}
        </Badge>
      </Group>

      <SimpleGrid
        cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing={{ base: 'sm', md: 'md' }}
      >
        {photos.map((photo) => (
          <PhotoCard key={photo.id} item={photo} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
