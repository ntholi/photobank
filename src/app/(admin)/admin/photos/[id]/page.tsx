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
  Group,
  ActionIcon,
} from '@mantine/core';
import { IconArrowLeft, IconEdit } from '@tabler/icons-react';
import NextLink from 'next/link';
import prisma from '@/lib/db';
import { toDateTime } from '@/lib/utils';
import DisplayField from '@/app/(admin)/base/DisplayField';
import PhotoStatusUpdate from './PhotoStatusUpdate';
import { thumbnail } from '@/lib/config/urls';
import { notFound } from 'next/navigation';
import EditableField from '@/app/(admin)/base/EditableField';
import { updateCaption } from './actions';

type Props = {
  params: {
    id: string;
  };
};

async function fetchPhoto(id: string) {
  return await prisma.photo.findUnique({
    where: { id: id },
    include: {
      user: true,
      location: true,
    },
  });
}

export default async function PhotoPage({ params }: Props) {
  const photo = await fetchPhoto(params.id);

  if (!photo) {
    notFound();
  }

  return (
    <div>
      <Paper withBorder p="lg">
        <Flex justify={'space-between'} align={'center'}>
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
        </Flex>
      </Paper>
      <Space h="md" />
      <Paper withBorder p="lg">
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <Image src={thumbnail(photo.fileName)} alt={photo.caption || ''} />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Stack mt="md" gap="sm">
              <DisplayField label="ID" value={photo.id} />
              <EditableField
                id={photo.id}
                label="Caption"
                value={photo.caption}
                action={updateCaption}
              />
              <DisplayField label="Owner">
                <Anchor component={NextLink} href={`/users/${photo.user.id}`}>
                  {fullName(photo.user)}
                </Anchor>
              </DisplayField>
              <EditableField
                id={photo.id}
                label="Location"
                value={photo.location?.name}
                action={updateCaption}
              />
              <DisplayField
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
