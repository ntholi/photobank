'use client';

import { contentLabels } from '@/db/schema';
import {
  Badge,
  Box,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

type ContentLabel = typeof contentLabels.$inferSelect;

type Props = {
  labels: ContentLabel[];
};

export function ContentLabels({ labels }: Props) {
  const sortedLabels = [...labels].sort((a, b) => b.confidence - a.confidence);

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
        <Badge variant='default' size='sm'>
          {sortedLabels.length} detected
        </Badge>
      </Group>

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 'sm', md: 'md' }}
      >
        {sortedLabels.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </SimpleGrid>
    </Stack>
  );
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
    <Card radius='md' withBorder>
      <Card.Section withBorder p={'xs'}>
        <Group justify='space-between' align='flex-start'>
          <Text fw={600} size='sm'>
            {label.name}
          </Text>
          <Badge
            color={getConfidenceColor(label.confidence / 100)}
            variant='light'
            size='sm'
          >
            {(label.confidence / 100).toFixed(2)}%
          </Badge>
        </Group>
      </Card.Section>

      <Box py={'md'}>
        {label.categories && label.categories.length > 0 && (
          <Group gap={4}>
            {label.categories.map((category, index) => (
              <Badge key={index} variant='default' size='xs' color='gray'>
                {category}
              </Badge>
            ))}
          </Group>
        )}
      </Box>

      <Card.Section withBorder p={'xs'}>
        {label.parents && label.parents.length > 0 && (
          <Text size='xs' c='gray.6'>
            {formatArray(label.parents)}
          </Text>
        )}

        {label.aliases && label.aliases.length > 0 && (
          <Text size='xs' c='gray.6'>
            {formatArray(label.aliases)}
          </Text>
        )}

        {label.instances && label.instances.length > 0 && (
          <Text size='xs' c='dimmed' mb={4}>
            {label.instances.length} instance
            {label.instances.length !== 1 ? 's' : ''}
          </Text>
        )}
      </Card.Section>
    </Card>
  );
}
