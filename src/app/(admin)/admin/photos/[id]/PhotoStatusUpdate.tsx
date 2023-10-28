'use client';
import DisplayField from '@/app/(admin)/base/DisplayField';
import { Badge, Box, Button, ButtonGroup, MantineSize } from '@mantine/core';
import { Photo, PhotoStatus } from '@prisma/client';
import { updateStatus } from './actions';
import { useTransition } from 'react';

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
    label: 'Draft',
    value: 'draft',
  },
] as const;

export default function PhotoStatusUpdate({ photo }: { photo: Photo }) {
  const [isPending, startTransition] = useTransition();
  return (
    <DisplayField label="Status">
      <StatusDisplay status={photo.status} />
      <Box mt="sm">
        <ButtonGroup>
          {items.map((item) => (
            <Button
              key={item.value}
              size="sm"
              disabled={isPending}
              variant="default"
              onClick={() =>
                startTransition(() => updateStatus(photo.id, item.value))
              }
            >
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </DisplayField>
  );
}

export const StatusDisplay = ({
  status,
  size,
}: {
  status: PhotoStatus;
  size?: MantineSize;
}) => {
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
    <Badge size={size} color={color} variant="outline">
      {status}
    </Badge>
  );
};
