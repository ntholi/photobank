import React from 'react';
import { Paper, Space, Title, Button, Image } from '@mantine/core';
import axios from 'axios';
import { api } from '@/lib/constants';
import { Photo } from '@prisma/client';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { toDateTime } from '@/lib/utils';
import FieldDisplay from '@/app/(admin)/base/FieldDisplay';
import PhotoStatusUpdate from './PhotoStatusUpdate';

type Props = {
  params: {
    id: string;
  };
};

async function fetchPhoto(id: string) {
  const photo = await prisma.photo.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
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
      <Paper withBorder p="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <Image src={photo.url} alt={photo.name} width={500} />
          <div className="space-y-3">
            <FieldDisplay label="ID" value={photo.id} />
            <FieldDisplay label="Name" value={photo.name} />
            <FieldDisplay label="Owner">
              <Link className="text-blue-600 hover:underline" href={`#`}>
                {fullName(photo.user)}
              </Link>
            </FieldDisplay>
            <FieldDisplay label="Location" value={photo.location} />
            <FieldDisplay
              label="Created At"
              value={toDateTime(photo.createdAt)}
            />
            <PhotoStatusUpdate photo={photo} />
          </div>
        </div>
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
