'use client';
import FieldDisplay from '@/app/(admin)/base/FieldDisplay';
import { Badge, Button } from '@mantine/core';
import React, { useState } from 'react';
import { Photo, PhotoStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const items = [
  {
    label: 'Publish',
    value: 'published',
  },
  {
    label: 'Reject',
    value: 'rejected',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
] as const;

export default function PhotoStatusUpdate({ photo }: { photo: Photo }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  function handleSelect(item: PhotoStatus) {
    setLoading(item);
    axios
      .put(`/api/photos/${photo.id}`, { status: item })
      .finally(() => setLoading(null));
    router.refresh();
  }

  return (
    <FieldDisplay label="Status">
      <StatusDisplay status={photo.status} />
      <div className="mt-2 space-x-2">
        {items.map((item) => (
          <Button
            key={item.value}
            size="xs"
            variant="default"
            onClick={() => handleSelect(item.value)}
            loading={loading === item.value}
          >
            {item.label}
          </Button>
        ))}
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
    case 'published':
      color = 'green';
      break;
    case 'rejected':
      color = 'red';
      break;
    default:
      color = 'gray';
  }
  return (
    <Badge color={color} variant="outline">
      {status}
    </Badge>
  );
};
