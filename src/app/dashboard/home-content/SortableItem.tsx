'use client';

import { ContentTypeBadge } from '@/app/dashboard/content/components/ContentTypeBadge';
import { StatusBadge } from '@/app/dashboard/content/components/StatusBadge';
import { DeleteButton } from '@/components/adease/DeleteButton';
import { getImageUrl } from '@/lib/utils';
import { removeContentFromHome } from '@/server/home-contet/actions';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ActionIcon,
  Card,
  Group,
  Image,
  Indicator,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconGripVertical } from '@tabler/icons-react';
import Link from 'next/link';

interface HomeContentItem {
  id: string;
  position: number;
  contentId: string;
  createdAt: Date | null;
  content: {
    id: string;
    fileName: string | null;
    thumbnailKey: string;
    watermarkedKey: string;
    type: 'image' | 'video';
    status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  };
}

export default function SortableItem({ item }: { item: HomeContentItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDeleteItem = async () => {
    await removeContentFromHome(item.contentId);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card padding='sm' radius='md' withBorder>
        <Group gap='sm' wrap='nowrap' align='center'>
          <ActionIcon
            variant='subtle'
            color='gray'
            {...attributes}
            {...listeners}
          >
            <IconGripVertical size={18} />
          </ActionIcon>

          <Indicator
            label={item.position + 1}
            size={20}
            color='blue'
            position='top-start'
          >
            <Link href={`/dashboard/content/${item.content.id}`}>
              <Image
                src={getImageUrl(item.content.thumbnailKey)}
                width={80}
                height={80}
                radius='sm'
                fit='cover'
                style={{ cursor: 'pointer' }}
                fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
              />
            </Link>
          </Indicator>

          <Stack gap={4} style={{ flex: 1 }}>
            <Text size='sm' fw={500} truncate>
              {item.content.fileName || 'Untitled'}
            </Text>
            <Group gap='xs'>
              <ContentTypeBadge contentType={item.content.type} />
              <StatusBadge
                status={item.content.status}
                variant='light'
                size='xs'
              />
            </Group>
          </Stack>

          <DeleteButton
            handleDelete={handleDeleteItem}
            message='Are you sure you want to remove this item from the home page?'
            queryKey={['home-content-with-details']}
            variant='subtle'
            size='sm'
            onSuccess={() => {
              notifications.show({
                title: 'Success',
                message: 'Item removed from home page',
                color: 'green',
              });
            }}
          />
        </Group>
      </Card>
    </div>
  );
}
