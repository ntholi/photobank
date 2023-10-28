import React from 'react';
import {
  Paper,
  Space,
  Title,
  Button,
  Image,
  Stack,
  Anchor,
  Flex,
  Grid,
  GridCol,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import NextLink from 'next/link';
import prisma from '@/lib/db';
import { toDateTime } from '@/lib/utils';
import FieldDisplay from '@/app/(admin)/base/FieldDisplay';
import PhotoStatusUpdate from './PhotoStatusUpdate';
import { thumbnail } from '@/lib/config/urls';

type Props = {
  params: {
    id: string;
  };
};

async function fetchPhoto(id: string) {
  const photo = await prisma.photo.findUnique({
    where: { id: id },
    include: {
      user: true,
      location: true,
    },
  });
  if (!photo) {
    throw new Error('Photo not found');
  }
  return photo;
}

export default async function PhotoPage({ params }: Props) {
  const photo = await fetchPhoto(params.id);

  return (
    <div>
      <Paper withBorder p="lg">
        <header className="flex items-center justify-between">
          <Title order={1} size={'h5'}>
            {photo.caption || 'No Caption'}
          </Title>

          <Button
            color="dark"
            leftSection={<IconArrowLeft size="1rem" />}
            component={NextLink}
            href={'./'}
          >
            Back
          </Button>
        </header>
      </Paper>
      <Space h="md" />
      <Paper withBorder p="lg">
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Image src={thumbnail(photo.fileName)} alt={photo.caption || ''} />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Stack mt="md" gap="sm">
              <FieldDisplay label="ID" value={photo.id} />
              <FieldDisplay
                label="Caption"
                value={photo.caption || 'No Caption'}
              />
              <FieldDisplay label="Owner">
                <Anchor component={NextLink} href={`/users/${photo.user.id}`}>
                  {fullName(photo.user)}
                </Anchor>
              </FieldDisplay>
              <FieldDisplay label="Location" value={photo?.location?.name} />
              <FieldDisplay
                label="Created At"
                value={toDateTime(photo.createdAt)}
              />
              <PhotoStatusUpdate photo={photo} />
            </Stack>
          </GridCol>
        </Grid>
      </Paper>
    </div>
  );
}

const fullName = (user: {
  firstName?: string | null;
  lastName?: string | null;
}) => {
  return `${user.firstName} ${user.lastName}`.trim();
};
