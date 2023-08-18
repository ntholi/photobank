import { ActionIcon, Paper, Space, Table, Title } from '@mantine/core';
import { IconReload } from '@tabler/icons-react';
import React from 'react';
import PhotosTable from './PhotosTable';
import { Photo } from '@prisma/client';
import { api } from '@/lib/constants';

const fetchPhotos = async () => {
  const response = await fetch(api('photos'));
  return (await response.json()) as Photo[];
};

export default async function PhotosPage() {
  const photos = await fetchPhotos();
  return (
    <div>
      <Paper withBorder p="lg">
        <header className="flex items-center justify-between">
          <Title order={1} size={'h5'}>
            Photos
          </Title>
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
