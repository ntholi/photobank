'use client';

import { ContentPicker } from '@/components/ContentPicker';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPhoto, IconPlus, IconRefresh } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import SortableItem from './SortableItem';

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
      await queryClient.cancelQueries({
        queryKey: ['home-content-with-details'],
      });

      const previousData = queryClient.getQueryData<HomeContentItem[]>([
        'home-content-with-details',
      ]);

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

      return { previousData };
    },
    onError: (err, updates, context) => {
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
      queryClient.invalidateQueries({
        queryKey: ['home-content-with-details'],
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
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
  };

  const handleContentSelect = (item: { id: string }) => {
    addMutation.mutate([item.id]);
    setPickerOpened(false);
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size='lg' />
      </Center>
    );
  }

  return (
    <Container size='lg' py={{ base: 'md', md: 'xl' }}>
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
