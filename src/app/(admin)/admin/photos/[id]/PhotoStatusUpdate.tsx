'use client';
import FieldDisplay from '@/app/(admin)/base/FieldDisplay';
import { Badge, Chip, Group } from '@mantine/core';
import React from 'react';
import { Photo, PhotoStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PhotoStatusUpdate({ photo }: { photo: Photo }) {
  const items = ['pending', 'approved', 'rejected'];
  const router = useRouter();

  function handleSelect(item: PhotoStatus) {
    axios.put(`/api/photos/${photo.id}`, { status: item });
    router.refresh();
  }

  return (
    <FieldDisplay label="Status">
      <StatusDisplay status={photo.status} />
      <div className="mt-1">
        <Chip.Group>
          <Group justify="center">
            {items.map((item) => (
              <Chip
                key={item}
                value={item}
                defaultChecked={item === status}
                onClick={() => handleSelect(item as PhotoStatus)}
              >
                {item}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </div>
    </FieldDisplay>
  );
}

export const StatusDisplay = ({ status }: { status: PhotoStatus }) => {
  let color: string;
  switch (status) {
    case 'pending':
      color = 'orange';
      break;
    case 'approved':
      color = 'green';
      break;
    case 'rejected':
      color = 'red';
      break;
    default:
      color = 'gray';
  }
  return <Badge color={color}>{status}</Badge>;
};
