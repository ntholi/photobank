'use client';

import {
  Badge,
  Card,
  Divider,
  Group,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getContentLabelsByContentId } from '@/server/content-labels/actions';
import { contentLabels } from '@/db/schema';

type ContentLabel = typeof contentLabels.$inferSelect;

interface ContentLabelsProps {
  contentId: string;
}

function LabelCard({ label }: { label: ContentLabel }) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'green';
    if (confidence >= 75) return 'blue';
    if (confidence >= 60) return 'yellow';
    if (confidence >= 40) return 'orange';
    return 'red';
  };

  const formatArray = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) return null;
    return arr.join(', ');
  };

  return (
    <Card padding='md' radius='md' withBorder>
      <Stack gap='sm'>
        <Group justify='space-between' align='flex-start'>
          <Text fw={600} size='sm'>
            {label.name}
          </Text>
          <Badge
            color={getConfidenceColor(label.confidence)}
            variant='light'
            size='sm'
          >
            {label.confidence}%
          </Badge>
        </Group>

        <Progress
          value={label.confidence}
          color={getConfidenceColor(label.confidence)}
          size='xs'
          radius='xl'
        />

        {label.categories && label.categories.length > 0 && (
          <Group gap={4}>
            {label.categories.map((category, index) => (
              <Badge key={index} variant='outline' size='xs' color='gray'>
                {category}
              </Badge>
            ))}
          </Group>
        )}

        <Divider />

        {label.parents && label.parents.length > 0 && (
          <Text size='xs' c='gray.6'>
            {formatArray(label.parents)}
          </Text>
        )}

        {label.aliases && label.aliases.length > 0 && (
          <div>
            <Text size='xs' c='dimmed' mb={4}>
              Aliases
            </Text>
            <Text size='xs' c='gray.6'>
              {formatArray(label.aliases)}
            </Text>
          </div>
        )}

        {label.instances && label.instances.length > 0 && (
          <Tooltip
            label={`${label.instances.length} instance${
              label.instances.length !== 1 ? 's' : ''
            } detected in image`}
            position='bottom'
          >
            <Badge variant='dot' size='xs' color='blue'>
              {label.instances.length} instance
              {label.instances.length !== 1 ? 's' : ''}
            </Badge>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} padding='md' radius='md' withBorder>
          <Stack gap='sm'>
            <Group justify='space-between'>
              <Skeleton height={16} width='60%' />
              <Skeleton height={20} width={45} radius='xl' />
            </Group>
            <Skeleton height={4} radius='xl' />
            <Skeleton height={12} width='40%' />
            <Group gap={4}>
              <Skeleton height={16} width={50} radius='xs' />
              <Skeleton height={16} width={40} radius='xs' />
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export function ContentLabels({ contentId }: ContentLabelsProps) {
  const {
    data: labelsResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contentLabels', contentId],
    queryFn: () => getContentLabelsByContentId(contentId),
    staleTime: 5 * 60 * 1000,
  });

  const labels = labelsResult?.items || [];
  const sortedLabels = [...labels].sort((a, b) => b.confidence - a.confidence);

  if (error) {
    return (
      <Stack gap='md'>
        <Title order={4} size='md'>
          Content Labels
        </Title>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='red'>
            Failed to load content labels
          </Text>
        </Card>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack gap='md'>
        <Title order={4} size='md'>
          Content Labels
        </Title>
        <LoadingSkeleton />
      </Stack>
    );
  }

  if (sortedLabels.length === 0) {
    return (
      <Stack gap='md'>
        <Title order={4} size='md'>
          Content Labels
        </Title>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='dimmed' ta='center'>
            No labels detected for this content
          </Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Title order={4} size='md'>
          Content Labels
        </Title>
        <Badge variant='light' color='blue'>
          {sortedLabels.length} detected
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
        {sortedLabels.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
