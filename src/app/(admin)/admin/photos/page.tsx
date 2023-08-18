import { ActionIcon, Paper, Space, Input, Title, Group } from '@mantine/core';
import { IconReload, IconSearch } from '@tabler/icons-react';
import React from 'react';
import PhotosTable from './PhotosTable';
import { Photo } from '@prisma/client';
import axios from 'axios';
import { api } from '@/lib/constants';

const fetchPhotos = async () => {
  const res = await axios.get(api('photos'));
  return res.data as Photo[];
};

export default async function PhotosPage() {
  const photos = await fetchPhotos();
  return (
    <div>
      <Paper withBorder p="lg">
        <header className="flex items-center justify-between">
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
        </header>
      </Paper>
      <Space h="md" />
      <PhotosTable photos={photos} />
    </div>
  );
}