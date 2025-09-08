'use client';

import { getContentUpdateLogsByContentIdWithUser } from '@/server/content-update-logs/actions';
import { getLocation } from '@/server/locations/actions';
import { UserRole } from '@/db/schema';
import {
  Avatar,
  Badge,
  Box,
  Card,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Timeline,
  Button,
  Skeleton,
  Center,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconUser,
  IconMapPin,
  IconFileText,
  IconTags,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

type AuditLogItem = Awaited<
  ReturnType<typeof getContentUpdateLogsByContentIdWithUser>
>['items'][number];

type Props = {
  contentId: string;
};

export function ContentAuditLog({ contentId }: Props) {
  const { data: session } = useSession();

  if (
    !session?.user?.role ||
    !['moderator', 'admin'].includes(session.user.role as UserRole)
  ) {
    return null;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['content-update-logs', contentId],
    queryFn: () => getContentUpdateLogsByContentIdWithUser(contentId, 1, 50),
  });

  if (isLoading) {
    return (
      <Stack gap='md'>
        <Title order={4} size='md'>
          Audit Log
        </Title>
        <Stack gap='sm'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} padding='md' radius='md' withBorder>
              <Group gap='sm'>
                <Skeleton height={40} circle />
                <Stack gap='xs' style={{ flex: 1 }}>
                  <Skeleton height={20} width='60%' />
                  <Skeleton height={16} width='40%' />
                </Stack>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack gap='md'>
        <Title order={4} size='md'>
          Audit Log
        </Title>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='dimmed' ta='center'>
            Failed to load audit log
          </Text>
        </Card>
      </Stack>
    );
  }

  const logs = data?.items || [];

  if (logs.length === 0) {
    return (
      <Stack gap='md'>
        <Title order={4} size='md'>
          Audit Log
        </Title>
        <Card padding='md' radius='md' withBorder>
          <Text size='sm' c='dimmed' ta='center'>
            No audit log entries found for this content
          </Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Title order={4} size='md'>
          Audit Log
        </Title>
        <Badge variant='default' size='sm'>
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
        </Badge>
      </Group>

      <ScrollArea h={400}>
        <Timeline active={logs.length} bulletSize={24} lineWidth={2}>
          {logs.map((log, index) => (
            <Timeline.Item
              key={log.id}
              bullet={getActionIcon(log.action)}
              title={
                <Group gap='sm' wrap='nowrap'>
                  <Avatar
                    src={log.user?.image}
                    alt={log.user?.name || 'Unknown user'}
                    size='sm'
                    radius='xl'
                  >
                    <IconUser size='1rem' />
                  </Avatar>
                  <Box style={{ flex: 1 }}>
                    <Text size='sm' fw={500}>
                      {log.user?.name || 'Unknown user'}
                    </Text>
                    <Group gap='xs'>
                      <Badge
                        variant={log.action === 'delete' ? 'filled' : 'light'}
                        color={log.action === 'delete' ? 'red' : 'blue'}
                        size='xs'
                      >
                        {log.action}
                      </Badge>
                      <Text size='xs' c='dimmed'>
                        {log.createdAt &&
                          formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                          })}
                      </Text>
                    </Group>
                  </Box>
                </Group>
              }
            >
              <DescriptiveAuditLogChanges log={log} />
            </Timeline.Item>
          ))}
        </Timeline>
      </ScrollArea>
    </Stack>
  );
}

function DescriptiveAuditLogChanges({ log }: { log: AuditLogItem }) {
  const locationIds = new Set<string>();
  if (log.oldValues?.locationId)
    locationIds.add(log.oldValues.locationId as string);
  if (log.newValues?.locationId)
    locationIds.add(log.newValues.locationId as string);

  const { data: locations } = useQuery({
    queryKey: ['locations-for-audit', Array.from(locationIds)],
    queryFn: async () => {
      const locationPromises = Array.from(locationIds).map((id) =>
        getLocation(id),
      );
      const results = await Promise.allSettled(locationPromises);
      const locationMap = new Map<string, string>();

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          locationMap.set(Array.from(locationIds)[index], result.value.name);
        }
      });

      return locationMap;
    },
    enabled: locationIds.size > 0,
  });

  if (log.action === 'delete') {
    return (
      <Box mt='xs'>
        <Text size='sm' c='red'>
          Content was deleted
        </Text>
      </Box>
    );
  }

  if (log.action === 'update') {
    if (!log.oldValues || !log.newValues) {
      return (
        <Text size='sm' c='dimmed' mt='xs'>
          No specific changes recorded
        </Text>
      );
    }

    const changes = generateChangeDescriptions(
      log.oldValues,
      log.newValues,
      locations || new Map(),
    );

    if (changes.length === 0) {
      return (
        <Text size='sm' c='dimmed' mt='xs'>
          No tracked changes found
        </Text>
      );
    }

    return (
      <Box mt='xs'>
        <Stack gap='xs'>
          {changes.map((change, index) => (
            <ChangeDescription key={index} change={change} />
          ))}
        </Stack>
      </Box>
    );
  }

  return null;
}

type ChangeInfo = {
  type: 'description' | 'location' | 'tags';
  icon: React.ReactNode;
  description: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
};

function ChangeDescription({ change }: { change: ChangeInfo }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Paper p='sm' radius='sm'>
      <Group gap='sm' wrap='nowrap'>
        {change.icon}
        <Box style={{ flex: 1 }}>
          <Text size='sm' fw={500}>
            {change.description}
          </Text>
          {change.details && (
            <>
              <Button
                variant='subtle'
                size='xs'
                leftSection={
                  opened ? (
                    <IconChevronUp size='0.8rem' />
                  ) : (
                    <IconChevronDown size='0.8rem' />
                  )
                }
                onClick={toggle}
                mt='xs'
              >
                {opened ? 'Hide' : 'Show'} details
              </Button>
              <Collapse in={opened}>
                <Box mt='xs' p='xs' style={{ borderRadius: 4 }}>
                  <Text size='xs' style={{ whiteSpace: 'pre-wrap' }}>
                    {change.details}
                  </Text>
                </Box>
              </Collapse>
            </>
          )}
        </Box>
      </Group>
    </Paper>
  );
}

function generateChangeDescriptions(
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
  locationMap: Map<string, string>,
): ChangeInfo[] {
  const changes: ChangeInfo[] = [];

  // Handle description changes
  if ('description' in oldValues || 'description' in newValues) {
    const oldDesc = oldValues.description as string | null;
    const newDesc = newValues.description as string | null;

    let description = '';
    let details = '';

    if (!oldDesc && newDesc) {
      description = 'Added description';
      details = `New description: "${newDesc}"`;
    } else if (oldDesc && !newDesc) {
      description = 'Removed description';
      details = `Previous description: "${oldDesc}"`;
    } else if (oldDesc && newDesc) {
      description = 'Updated description';
      details = `Previous: "${oldDesc}"\n\nNew: "${newDesc}"`;
    }

    if (description) {
      changes.push({
        type: 'description',
        icon: <IconFileText size='1rem' color='blue' />,
        description,
        details,
      });
    }
  }

  // Handle location changes
  if ('locationId' in oldValues || 'locationId' in newValues) {
    const oldLocationId = oldValues.locationId as string | null;
    const newLocationId = newValues.locationId as string | null;

    let description = '';
    let details = '';

    const oldLocationName = oldLocationId
      ? locationMap.get(oldLocationId) || `Location ID: ${oldLocationId}`
      : null;
    const newLocationName = newLocationId
      ? locationMap.get(newLocationId) || `Location ID: ${newLocationId}`
      : null;

    if (!oldLocationId && newLocationId) {
      description = 'Added location';
      details = `Location: ${newLocationName}`;
    } else if (oldLocationId && !newLocationId) {
      description = 'Removed location';
      details = `Previous location: ${oldLocationName}`;
    } else if (oldLocationId && newLocationId) {
      description = 'Changed location';
      details = `From: ${oldLocationName}\nTo: ${newLocationName}`;
    }

    if (description) {
      changes.push({
        type: 'location',
        icon: <IconMapPin size='1rem' color='green' />,
        description,
        details,
      });
    }
  }

  // Handle tag changes
  if ('tags' in oldValues || 'tags' in newValues) {
    const oldTags =
      (oldValues.tags as Array<{ name: string; confidence: number }>) || [];
    const newTags =
      (newValues.tags as Array<{ name: string; confidence: number }>) || [];

    let description = '';
    let details = '';

    if (oldTags.length === 0 && newTags.length > 0) {
      description = `Added ${newTags.length} tag${newTags.length > 1 ? 's' : ''}`;
      details = `Added tags:\n${newTags.map((t) => `• ${t.name} (${t.confidence}% confidence)`).join('\n')}`;
    } else if (oldTags.length > 0 && newTags.length === 0) {
      description = `Removed all ${oldTags.length} tag${oldTags.length > 1 ? 's' : ''}`;
      details = `Removed tags:\n${oldTags.map((t) => `• ${t.name} (${t.confidence}% confidence)`).join('\n')}`;
    } else if (oldTags.length > 0 && newTags.length > 0) {
      const addedTags = newTags.filter(
        (nt) => !oldTags.some((ot) => ot.name === nt.name),
      );
      const removedTags = oldTags.filter(
        (ot) => !newTags.some((nt) => nt.name === ot.name),
      );
      const changedTags = newTags.filter((nt) => {
        const oldTag = oldTags.find((ot) => ot.name === nt.name);
        return oldTag && oldTag.confidence !== nt.confidence;
      });

      const changes = [];
      if (addedTags.length > 0)
        changes.push(`Added: ${addedTags.map((t) => t.name).join(', ')}`);
      if (removedTags.length > 0)
        changes.push(`Removed: ${removedTags.map((t) => t.name).join(', ')}`);
      if (changedTags.length > 0)
        changes.push(
          `Updated confidence: ${changedTags.map((t) => t.name).join(', ')}`,
        );

      if (changes.length > 0) {
        description = 'Updated tags';
        details = changes.join('\n');
      }
    }

    if (description) {
      changes.push({
        type: 'tags',
        icon: <IconTags size='1rem' color='orange' />,
        description,
        details,
      });
    }
  }

  return changes;
}

function getActionIcon(action: string) {
  switch (action) {
    case 'update':
      return <IconEdit size='1rem' />;
    case 'delete':
      return <IconTrash size='1rem' />;
    default:
      return <IconClock size='1rem' />;
  }
}
