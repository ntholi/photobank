import {
  ActionIcon,
  Paper,
  Space,
  Input,
  Title,
  Group,
  Flex,
} from '@mantine/core';
import { IconReload, IconSearch } from '@tabler/icons-react';
import React from 'react';
import PhotosTable from './PhotosTable';
import { Photo } from '@prisma/client';
import prisma from '@/lib/db';

const fetchPhotos = async () => {
  const photos = prisma.photo.findMany({});
  return photos;
};

export default async function PhotosPage() {
  const photos = await fetchPhotos();
  return (
    <div>
      <Paper withBorder p="lg">
        <Flex justify={'space-between'} align={'center'}>
          <Group>
            <Title order={1} size={'h5'}>
              Photos
            </Title>
            <Input
              placeholder="Search"
              rightSection={<IconSearch size="1.125rem" />}
            />
          </Group>
          <ActionIcon
            size={'lg'}
            variant="filled"
            color="dark"
            aria-label="Reload"
          >
            <IconReload size={'1rem'} />
          </ActionIcon>
        </Flex>
      </Paper>
      <Space h="md" />
      <PhotosTable photos={photos} />
    </div>
  );
}
