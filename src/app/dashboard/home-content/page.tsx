'use client';

import { useState, useCallback } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Grid,
  Card,
  Image,
  Text,
  ActionIcon,
  Stack,
  Center,
  Loader,
  Badge,
  Box,
  Paper,
  Flex,
  Tooltip,
  HoverCard,
  Indicator,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconPhoto,
  IconRefresh,
} from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentPicker } from '@/components/ContentPicker';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { getImageUrl } from '@/lib/utils';
import {
  getAllHomeContentWithDetails,
  addContentToHome,
  removeContentFromHome,
  updateHomeContentOrder,
} from '@/server/home-contet/actions';
import { content } from '@/db/schema';
import { StatusBadge } from '@/app/dashboard/content/components/StatusBadge';
import { ContentTypeBadge } from '@/app/dashboard/content/components/ContentTypeBadge';

type ContentItem = typeof content.$inferSelect;

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

function SortableItem({
  item,
  onRemove,
}: {
  item: HomeContentItem;
  onRemove: (id: string) => void;
}) {
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
  const imageSize = 80;

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        padding='sm'
        radius='md'
        withBorder
        style={{
          cursor: 'grab',
          borderColor: isDragging ? 'var(--mantine-color-blue-6)' : undefined,
        }}
      >
        <Group gap='sm' wrap='nowrap' align='center'>
          <ActionIcon
            {...attributes}
            {...listeners}
            variant='subtle'
            color='gray'
            style={{ cursor: 'grab' }}
          >
            <IconGripVertical size={18} />
          </ActionIcon>

          <HoverCard position='top-start' shadow='md' withinPortal>
            <HoverCard.Target>
              <Indicator
                label={item.position + 1}
                size={20}
                color='blue'
                position='top-start'
              >
                <Image
                  src={getImageUrl(item.content.thumbnailKey)}
                  width={imageSize}
                  height={imageSize}
                  radius='sm'
                  fit='cover'
                  fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                />
              </Indicator>
            </HoverCard.Target>
            <HoverCard.Dropdown p={0}>
              <Image
                src={getImageUrl(item.content.thumbnailKey)}
                width={320}
                height={200}
                fit='cover'
              />
            </HoverCard.Dropdown>
          </HoverCard>

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

          <Tooltip label='Remove from home' withArrow>
            <ActionIcon
              variant='subtle'
              color='red'
              onClick={() => onRemove(item.contentId)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Card>
    </div>
  );
}

export default function HomeContentPage() {
  const [pickerOpened, setPickerOpened] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const removeMutation = useMutation({
    mutationFn: removeContentFromHome,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['home-content-with-details'],
      });
      notifications.show({
        title: 'Success',
        message: 'Removed content from home',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove content',
        color: 'red',
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: updateHomeContentOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['home-content-with-details'],
      });
      notifications.show({
        title: 'Success',
        message: 'Updated content order',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to update order',
        color: 'red',
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
          const updates = newOrder.map(
            (item: HomeContentItem, index: number) => ({
              id: item.id,
              position: index,
            })
          );

          orderMutation.mutate(updates);
        }
      }
      setActiveId(null);
    },
    [homeContent, orderMutation]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleContentSelect = useCallback(
    (items: ContentItem[]) => {
      const contentIds = items.map((item) => item.id);
      addMutation.mutate(contentIds);
    },
    [addMutation]
  );

  const handleRemove = useCallback(
    (contentId: string) => {
      modals.openConfirmModal({
        centered: true,
        title: 'Remove from home',
        children: 'This item will be removed from the home page.',
        labels: { confirm: 'Remove', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => removeMutation.mutate(contentId),
      });
    },
    [removeMutation]
  );

  const existingContentIds = homeContent?.map((item) => item.contentId) || [];

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
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveId(null)}
            >
              <SortableContext
                items={homeContent.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack gap='sm'>
                  {homeContent.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                    />
                  ))}
                </Stack>
              </SortableContext>
              <DragOverlay>
                {activeId
                  ? (() => {
                      const activeItem = homeContent?.find(
                        (i) => i.id === activeId
                      );
                      if (!activeItem) return null;
                      const imageSize = 80;
                      return (
                        <Card padding='sm' radius='md' withBorder>
                          <Group gap='sm' wrap='nowrap' align='center'>
                            <Image
                              src={getImageUrl(activeItem.content.thumbnailKey)}
                              width={imageSize}
                              height={imageSize}
                              radius='sm'
                              fit='cover'
                            />
                            <Stack gap={4} style={{ flex: 1 }}>
                              <Text size='sm' fw={500} truncate>
                                {activeItem.content.fileName || 'Untitled'}
                              </Text>
                              <Group gap='xs'>
                                <ContentTypeBadge
                                  contentType={activeItem.content.type}
                                />
                                <StatusBadge
                                  status={activeItem.content.status}
                                  variant='light'
                                  size='xs'
                                />
                              </Group>
                            </Stack>
                          </Group>
                        </Card>
                      );
                    })()
                  : null}
              </DragOverlay>
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
          multiple
          selectedIds={existingContentIds}
          title='Add Content to Home Page'
        />
      </Stack>
    </Container>
  );
}
