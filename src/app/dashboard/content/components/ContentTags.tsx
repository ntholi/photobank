'use client';

import { getContentWithDetails } from '@/server/content/actions';
import {
  Badge,
  Card,
  Group,
  Paper,
  Popover,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTag } from '@tabler/icons-react';
import Link from 'next/link';

type ContentTag = NonNullable<
  Awaited<ReturnType<typeof getContentWithDetails>>
>['tags'][number];

type Props = {
  tags: ContentTag[];
};

export function ContentTags({ tags }: Props) {
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

function TagBadge({ tag }: { tag: ContentTag }) {
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
          {tag.tag.name}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text size='sm'>Confidence: {confidencePercent}%</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
