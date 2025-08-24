'use client';

import {
  DetailsView,
  DetailsViewHeader,
  DetailsViewBody,
  FieldView,
} from '@/components/adease';
import {
  Grid,
  GridCol,
  Card,
  Center,
  Stack,
  Group,
  Skeleton,
} from '@mantine/core';

function ProfileSkeleton() {
  return (
    <Grid>
      <GridCol span={{ base: 12, md: 5 }}>
        <Card withBorder p='sm'>
          <Center>
            <Skeleton height={200} width={200} radius='50%' />
          </Center>
        </Card>
      </GridCol>
      <GridCol span={{ base: 12, md: 7 }}>
        <Stack gap='lg' p='sm'>
          <FieldView label='Name'>
            <Skeleton height={16} width={150} />
          </FieldView>
          <Group align='center'>
            <Skeleton height={14} width={80} />
            <Skeleton height={20} width={60} radius='xl' />
          </Group>
          <FieldView label='Email'>
            <Skeleton height={16} width={180} />
          </FieldView>
        </Stack>
      </GridCol>
    </Grid>
  );
}

export default function Loading() {
  return (
    <DetailsView>
      <DetailsViewHeader
        title='Loading user...'
        queryKey={['users']}
        handleDelete={async () => {}}
      />
      <DetailsViewBody>
        <ProfileSkeleton />
      </DetailsViewBody>
    </DetailsView>
  );
}
