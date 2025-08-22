'use client';

import { ContentTypeBadge } from '@/app/dashboard/content/components/ContentTypeBadge';
import { StatusBadge } from '@/app/dashboard/content/components/StatusBadge';
import { ContentPicker } from '@/components/ContentPicker';
import { DeleteButton } from '@/components/adease/DeleteButton';
import { getImageUrl } from '@/lib/utils';
import {
  addContentToHome,
  getAllHomeContentWithDetails,
  updateHomeContentOrder,
} from '@/server/home-contet/actions';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Indicator,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconGripVertical,
  IconPhoto,
  IconPlus,
  IconRefresh,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { removeContentFromHome } from '@/server/home-contet/actions';

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

function SortableItem({ item }: { item: HomeContentItem }) {
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

  const handleDeleteItem = useCallback(async () => {
    await removeContentFromHome(item.contentId);
  }, [item.contentId]);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card padding='sm' radius='md' withBorder>
        <Group gap='sm' wrap='nowrap' align='center'>
          <ActionIcon variant='subtle' color='gray'>
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
          />
        </Group>
      </Card>
    </div>
  );
}

export default function HomeContentPage() {
  const [pickerOpened, setPickerOpened] = useState(false);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: homeContent, isLoading } = useQuery({
    queryKey: ['home-content-with-details'],
    queryFn: getAllHomeContentWithDetails,
  });

  const addMutation = useMutation({
    mutationFn: addContentToHome,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['home-content-with-details'],
      });
      notifications.show({
        title: 'Success',
        message: `Added ${data.added} item${data.added !== 1 ? 's' : ''} to home content`,
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to add content to home',
        color: 'red',
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: updateHomeContentOrder,
    onMutate: async (updates: { id: string; position: number }[]) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['home-content-with-details'],
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<HomeContentItem[]>([
        'home-content-with-details',
      ]);

      // Optimistically update to the new value
      if (previousData) {
        const updatedData = [...previousData];
        updates.forEach((update) => {
          const itemIndex = updatedData.findIndex(
            (item) => item.id === update.id
          );
          if (itemIndex !== -1) {
            updatedData[itemIndex] = {
              ...updatedData[itemIndex],
              position: update.position,
            };
          }
        });

        updatedData.sort((a, b) => a.position - b.position);

        queryClient.setQueryData<HomeContentItem[]>(
          ['home-content-with-details'],
          updatedData
        );
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, updates, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(
          ['home-content-with-details'],
          context.previousData
        );
      }
      notifications.show({
        title: 'Error',
        message: 'Failed to update order',
        color: 'red',
      });
    },
    onSuccess: () => {
      // Optionally invalidate queries to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: ['home-content-with-details'],
      });
    },
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id && homeContent) {
        const oldIndex = homeContent.findIndex((item) => item.id === active.id);
        const newIndex = homeContent.findIndex((item) => item.id === over?.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(homeContent, oldIndex, newIndex);
          const updates = newOrder.map((item, index) => ({
            id: item.id,
            position: index,
          }));
          orderMutation.mutate(updates);
        }
      }
    },
    [homeContent, orderMutation]
  );

  const handleContentSelect = useCallback(
    (item: { id: string }) => {
      addMutation.mutate([item.id]);
      setPickerOpened(false);
    },
    [addMutation]
  );

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size='lg' />
      </Center>
    );
  }

  return (
    <Container size='lg' py='xl'>
      <Stack gap='lg'>
        <Group justify='space-between'>
          <Title order={2}>Home Content Management</Title>
          <Group>
            <Button
              leftSection={<IconRefresh size={18} />}
              variant='default'
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['home-content-with-details'],
                })
              }
            >
              Refresh
            </Button>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setPickerOpened(true)}
            >
              Add Content
            </Button>
          </Group>
        </Group>

        <Paper p='md' radius='md' withBorder>
          <Text size='sm' c='dimmed' mb='md'>
            Drag and drop items to reorder them. The order shown here will be
            reflected on the home page.
          </Text>

          {homeContent && homeContent.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={homeContent.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack gap='sm'>
                  {homeContent.map((item) => (
                    <SortableItem key={item.id} item={item} />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          ) : (
            <Center h={200}>
              <Stack align='center' gap='xs'>
                <IconPhoto size={48} style={{ opacity: 0.5 }} />
                <Text c='dimmed'>No content added to home yet</Text>
                <Button
                  size='sm'
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setPickerOpened(true)}
                >
                  Add First Content
                </Button>
              </Stack>
            </Center>
          )}
        </Paper>

        <ContentPicker
          opened={pickerOpened}
          onClose={() => setPickerOpened(false)}
          onSelect={handleContentSelect}
          title='Add Image to Home Page'
        />
      </Stack>
    </Container>
  );
}
