import React from 'react';
import { Paper, Space, Title, Button, Image } from '@mantine/core';
import axios from 'axios';
import { api } from '@/lib/constants';
import { Photo } from '@prisma/client';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';

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

  console.log(photo);

  // return <>Hello World</>;

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
          <Image src={photo.url} alt={photo.name} width={500} height={500} />
          <div className="space-y-3">
            <FieldDisplay label="ID" value={photo.id} />
            <FieldDisplay label="Name" value={photo.name} />
            <FieldDisplay label="Owner" value={photo.userId} />
            {/* <FieldDisplay label="Created At" value={photo.createdAt} /> */}
          </div>
        </div>
      </Paper>
    </div>
  );
}

const FieldDisplay = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: any;
  children?: any;
}) => (
  <div className="">
    <div className="text-gray-500 font-bold text-sm">{label}</div>
    {value ? <div className="text-gray-900">{value}</div> : children}
  </div>
);
