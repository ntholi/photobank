'use client';
import FieldDisplay from '@/app/(admin)/base/FieldDisplay';
import { Badge, Box, Button, ButtonGroup, MantineSize } from '@mantine/core';
import { Photo, PhotoStatus } from '@prisma/client';
import { updateStatus } from './actions';

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
  return (
    <FieldDisplay label="Status">
      <StatusDisplay status={photo.status} />
      <Box mt="sm">
        <ButtonGroup>
          {items.map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant="default"
              onClick={() => updateStatus(photo.id, item.value)}
            >
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </FieldDisplay>
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
