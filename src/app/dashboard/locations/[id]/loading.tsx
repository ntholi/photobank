'use client';

import {
  DetailsView,
  DetailsViewHeader,
  DetailsViewBody,
} from '@/components/adease';
import {
  Tabs,
  Stack,
  Card,
  Image,
  Box,
  Skeleton,
  SimpleGrid,
  AspectRatio,
  Group,
} from '@mantine/core';

function AboutSkeleton() {
  return (
    <Stack gap='md'>
      <Card withBorder p='sm'>
        <AspectRatio ratio={16 / 9}>
          <Skeleton height='100%' radius='sm' />
        </AspectRatio>
      </Card>
      <Card withBorder p='sm'>
        <Stack gap='xs'>
          <Skeleton height={16} width={150} />
          <Skeleton height={14} width='100%' />
          <Skeleton height={14} width='90%' />
          <Skeleton height={14} width='80%' />
          <Skeleton height={14} width='95%' />
          <Skeleton height={14} width='70%' />
        </Stack>
      </Card>
    </Stack>
  );
}

function ContentSkeleton() {
  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Skeleton height={16} width={80} />
        <Skeleton height={20} width={50} radius='xl' />
      </Group>

      <SimpleGrid
        cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing={{ base: 'sm', md: 'md' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
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
    </Stack>
  );
}

function DetailsSkeleton() {
  return (
    <Stack gap='md'>
      <Group align='center'>
        <Skeleton height={14} width={80} />
        <Skeleton height={14} width={200} />
      </Group>
      <Group align='center'>
        <Skeleton height={14} width={80} />
        <Skeleton height={14} width={180} />
      </Group>
      <Group align='center'>
        <Skeleton height={14} width={80} />
        <Skeleton height={14} width={220} />
      </Group>
    </Stack>
  );
}

export default function Loading() {
  return (
    <DetailsView>
      <DetailsViewHeader
        title='Loading location...'
        queryKey={['locations']}
        handleDelete={async () => {}}
      />
      <DetailsViewBody>
        <Tabs defaultValue='about' keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value='about'>
              <Skeleton height={14} width={40} />
            </Tabs.Tab>
            <Tabs.Tab value='content'>
              <Skeleton height={14} width={50} />
            </Tabs.Tab>
            <Tabs.Tab value='details'>
              <Skeleton height={14} width={50} />
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='about' pt='xl'>
            <AboutSkeleton />
          </Tabs.Panel>

          <Tabs.Panel value='content' pt='xl'>
            <ContentSkeleton />
          </Tabs.Panel>

          <Tabs.Panel value='details' pt='xl'>
            <DetailsSkeleton />
          </Tabs.Panel>
        </Tabs>
      </DetailsViewBody>
    </DetailsView>
  );
}
