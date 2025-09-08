'use client';

import { DetailsView, DetailsViewBody } from '@/components/adease';
import { ContentDetailsHeader } from '../components/ContentDetailsHeader';
import {
  Paper,
  Stack,
  Skeleton,
  Tabs,
  Card,
  Group,
  Box,
  AspectRatio,
} from '@mantine/core';

function ContentDisplaySkeleton() {
  return (
    <Paper p='md' withBorder>
      <Tabs value='preview' keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value='thumbnail'>
            <Skeleton height={14} width={60} />
          </Tabs.Tab>
          <Tabs.Tab value='preview'>
            <Skeleton height={14} width={50} />
          </Tabs.Tab>
          <Tabs.Tab value='original'>
            <Skeleton height={14} width={55} />
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='preview' mt='md'>
          <AspectRatio ratio={16 / 9} maw={800}>
            <Skeleton height='100%' radius='md' />
          </AspectRatio>
        </Tabs.Panel>
      </Tabs>

      <Group mt='md' justify='space-between'>
        <Box>
          <Skeleton height={16} width={200} />
          <Skeleton height={12} width={80} mt={4} />
        </Box>
        <Stack gap={0} align='flex-end'>
          <Skeleton height={16} width={100} />
          <Skeleton height={12} width={60} />
        </Stack>
      </Group>
    </Paper>
  );
}

function ContentIdSkeleton() {
  return (
    <Box>
      <Group justify='space-between'>
        <Group gap={4}>
          <Skeleton height={14} width={20} />
          <Skeleton height={14} width={150} />
          <Skeleton height={20} width={50} radius='xl' />
        </Group>
        <Skeleton height={16} width={16} />
      </Group>
      <Skeleton height={1} width='100%' mt='xs' />
    </Box>
  );
}

function DescriptionSkeleton() {
  return (
    <Card padding='md' radius='md' withBorder>
      <Skeleton height={14} width={100} mb='sm' />
      <Stack gap='xs'>
        <Skeleton height={14} width='100%' />
        <Skeleton height={14} width='90%' />
        <Skeleton height={14} width='70%' />
      </Stack>
    </Card>
  );
}

function TagsSkeleton() {
  return (
    <Card padding='md' radius='md' withBorder>
      <Group justify='space-between' align='center' mb='md'>
        <Group align='center' gap='xs'>
          <Skeleton height={18} width={18} />
          <Skeleton height={20} width={80} />
        </Group>
        <Skeleton height={20} width={50} radius='xl' />
      </Group>
      <Group gap={8}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={28} width={80} radius='sm' />
        ))}
      </Group>
    </Card>
  );
}

function LabelsSkeleton() {
  return (
    <Card padding='md' radius='md' withBorder>
      <Group justify='space-between' align='center' mb='md'>
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={50} radius='xl' />
      </Group>
      <Stack gap='md'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} radius='md' withBorder>
            <Card.Section withBorder p='xs'>
              <Group justify='space-between' align='flex-start'>
                <Skeleton height={16} width={120} />
                <Skeleton height={20} width={45} radius='xl' />
              </Group>
            </Card.Section>
            <Box py='md'>
              <Group gap={4}>
                <Skeleton height={16} width={50} radius='xs' />
                <Skeleton height={16} width={40} radius='xs' />
              </Group>
            </Box>
            <Card.Section withBorder p='xs'>
              <Skeleton height={12} width={80} />
              <Skeleton height={12} width={60} mt={4} />
            </Card.Section>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}

function AuditLogSkeleton() {
  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Skeleton height={24} width={120} />
        <Skeleton height={20} width={60} />
      </Group>
      <Stack gap='sm'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} padding='md' radius='md' withBorder>
            <Group gap='sm' wrap='nowrap'>
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

export default function Loading() {
  return (
    <DetailsView>
      <ContentDetailsHeader
        title='Loading...'
        status='draft'
        queryKey={['content']}
        handleDelete={async () => {}}
      />
      <DetailsViewBody>
        <Stack gap='lg'>
          <ContentDisplaySkeleton />
          <ContentIdSkeleton />
          <DescriptionSkeleton />
          <TagsSkeleton />
          <LabelsSkeleton />
          <AuditLogSkeleton />
        </Stack>
      </DetailsViewBody>
    </DetailsView>
  );
}
