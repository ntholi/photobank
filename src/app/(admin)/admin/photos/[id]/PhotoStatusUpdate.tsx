import FieldDisplay from '@/app/(admin)/base/FieldDisplay';
import { Badge, Chip } from '@mantine/core';
import React from 'react';
import { Photo, PhotoStatus } from '@prisma/client';

export default function PhotoStatusUpdate({ photo }: { photo: Photo }) {
  return (
    <FieldDisplay label="Status">
      <StatusDisplay status={photo.status} />
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
