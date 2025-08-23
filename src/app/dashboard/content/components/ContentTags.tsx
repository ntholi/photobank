'use client';

import {
  Badge,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Popover,
  Box,
  Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { getContentTags } from '@/server/content-tags/actions';
import Link from 'next/link';
import { IconTag } from '@tabler/icons-react';

type ContentTagItem = {
  contentId: string;
  tagId: string;
  confidence: number | null;
  createdAt: Date | null;
  tagName: string;
  tagSlug: string;
};

type ContentTagsProps = {
  contentId: string;
};

function LoadingSkeleton() {
  return (
    <Group gap={8}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} height={28} width={80} radius='sm' />
      ))}
    </Group>
  );
}

function TagBadge({ tag }: { tag: ContentTagItem }) {
  const [opened, { close, open }] = useDisclosure(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'green';
    if (confidence >= 75) return 'blue';
    if (confidence >= 60) return 'yellow';
    return 'orange';
  };

  const confidence = tag.confidence || 100;
  const confidencePercent = Math.round(confidence);

  return (
    <Popover position='top' withArrow shadow='md' opened={opened}>
      <Popover.Target>
        <Badge
          style={{ cursor: 'pointer' }}
          component={Link}
          href={`/dashboard/tags/${tag.tagId}`}
          variant='transparent'
          color={getConfidenceColor(confidencePercent)}
          size='md'
          onMouseEnter={open}
          onMouseLeave={close}
          leftSection={<IconTag size={12} />}
        >
          {tag.tagName}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text size='sm'>Confidence: {confidencePercent}%</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

export function ContentTags({ contentId }: ContentTagsProps) {
  const { data, isLoading, error } = useQuery<ContentTagItem[]>({
    queryKey: ['contentTags', contentId],
    queryFn: () => getContentTags(contentId),
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    return (
      <Stack gap='md'>
        <Group align='center' gap='xs'>
          <IconTag size={18} />
          <Title order={4} size='md'>
            Tags
          </Title>
        </Group>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='red'>
            Failed to load tags
          </Text>
        </Card>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack gap='md'>
        <Group align='center' gap='xs'>
          <IconTag size={18} />
          <Title order={4} size='md'>
            Tags
          </Title>
        </Group>
        <LoadingSkeleton />
      </Stack>
    );
  }

  const tags = data || [];
  const sortedTags =
    tags.length > 0
      ? [...tags].sort((a, b) => {
          const aConf = a.confidence || 100;
          const bConf = b.confidence || 100;
          return bConf - aConf;
        })
      : [];

  if (sortedTags.length === 0) {
    return (
      <Stack gap='md'>
        <Group align='center' gap='xs'>
          <IconTag size={18} />
          <Title order={4} size='md'>
            Tags
          </Title>
        </Group>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='dimmed' ta='center'>
            No tags assigned to this content
          </Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Group align='center' gap='xs'>
          <IconTag size={18} />
          <Title order={4} size='md'>
            Tags
          </Title>
        </Group>
        <Badge variant='default' size='sm' radius='xl'>
          {sortedTags.length} {sortedTags.length === 1 ? 'tag' : 'tags'}
        </Badge>
      </Group>

      <Paper p='md' radius='md' withBorder>
        <Group gap={8}>
          {sortedTags.map((tag) => (
            <TagBadge key={tag.tagId} tag={tag} />
          ))}
        </Group>
      </Paper>
    </Stack>
  );
}
