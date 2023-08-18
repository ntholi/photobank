import React from 'react';
import { Paper, Space, Title, Button } from '@mantine/core';
import axios from 'axios';
import { api } from '@/lib/constants';
import { Photo } from '@prisma/client';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

async function fetchPhoto(id: string) {
  const res = await axios.get(api(`photos/${id}`));
  return res.data as Photo;
}

export default async function PhotoPage({ params }: Props) {
  const { id } = params;
  const photo = await fetchPhoto(id);

  return (
    <div>
      <Paper withBorder p="lg">
        <header className="flex items-center justify-between">
          <Title order={1} size={'h5'}>
            {photo.name}
          </Title>

          <Button
            color="dark"
            leftSection={<IconArrowLeft size="1rem" />}
            component={Link}
            href={'./'}
          >
            Back
          </Button>
        </header>
      </Paper>
      <Space h="md" />
    </div>
  );
}
