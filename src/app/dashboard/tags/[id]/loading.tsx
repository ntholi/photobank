'use client';

import {
  DetailsView,
  DetailsViewHeader,
  DetailsViewBody,
  FieldView,
} from '@/components/adease';
import {
  Stack,
  Group,
  Badge,
  SimpleGrid,
  Card,
  AspectRatio,
  Box,
  Skeleton,
} from '@mantine/core';

function TagContentSkeleton() {
  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center'>
        <Group align='center' gap='xs'>
          <Skeleton height={18} width={18} />
          <Skeleton height={20} width={60} />
        </Group>
        <Skeleton height={20} width={50} radius='xl' />
      </Group>

      <SimpleGrid
        cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing={{ base: 'sm', md: 'md' }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
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

export default function Loading() {
  return (
    <DetailsView>
      <DetailsViewHeader
        title='Loading tag...'
        queryKey={['tags']}
        handleDelete={async () => {}}
      />
      <DetailsViewBody>
        <Stack gap='lg'>
          <FieldView label='Name'>
            <Skeleton height={16} width={120} />
          </FieldView>
          <FieldView label='Slug'>
            <Skeleton height={16} width={140} />
          </FieldView>
          <TagContentSkeleton />
        </Stack>
      </DetailsViewBody>
    </DetailsView>
  );
}
