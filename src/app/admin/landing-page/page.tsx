'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import {
  Divider,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  getHomePhotos,
  handleAdd,
  handleDelete,
  handleReorder,
} from './actions';
import AddButton from './AddButton';
import { SortablePhoto } from './SortablePhoto';

interface HomePhoto {
  id: number;
  photo: {
    id: string;
    fileName: string;
  };
  order: number;
}

export default function HomePage() {
  const [photos, setPhotos] = useState<HomePhoto[]>([]);

  useEffect(() => {
    getHomePhotos().then((data) => setPhotos(data));
  }, []);

  async function handlePhotoAdd(photoId: string) {
    await handleAdd(photoId);
    const res = await fetch('/api/home-photos');
    const data = await res.json();
    setPhotos(data);
  }

  async function handlePhotoDelete(id: number) {
    await handleDelete(id);
    setPhotos(photos.filter((photo) => photo.id !== id));
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      await handleReorder(active.id, over.id);
      const res = await fetch('/api/home-photos');
      const data = await res.json();
      setPhotos(data);
    }
  }

  return (
    <Stack>
      <Paper p='lg' withBorder>
        <Flex justify={'space-between'} align={'center'}>
          <Title fw={'lighter'} size={18} c='gray'>
            Landing Page
          </Title>
          <AddButton handleAdd={handlePhotoAdd} />
        </Flex>
      </Paper>
      <Paper withBorder p={50}>
        <Stack gap={'xs'}>
          <Text size='0.9rem'>
            Image that will be shown on the landing page. Drag and drop to
            reorder.
          </Text>
          <Divider />
        </Stack>
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={photos.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <SimpleGrid cols={4} mt={'xl'}>
              {photos.map((item) => (
                <SortablePhoto
                  key={item.id}
                  id={item.id}
                  photo={item.photo}
                  handleDelete={handlePhotoDelete}
                />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      </Paper>
    </Stack>
  );
}
