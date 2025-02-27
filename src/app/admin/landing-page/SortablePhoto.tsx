'use client';

import { Box, Image } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { thumbnail } from '@/lib/config/urls';
import DeleteButton from './DeleteButton';

interface SortablePhotoProps {
  id: number;
  photo: {
    id: string;
    fileName: string;
  };
  handleDelete: (id: number) => Promise<void>;
}

export function SortablePhoto({ id, photo, handleDelete }: SortablePhotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? 1.03 : 1,
    boxShadow: isDragging ? '0 0 20px rgba(0,0,0,0.15)' : 'none',
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners} p='xs'>
      <Box pos={'relative'}>
        <DeleteButton
          pos={'absolute'}
          top={5}
          right={5}
          photo={photo}
          handleDelete={async () => {
            try {
              await handleDelete(id);
            } catch (error) {
              console.error('Failed to delete:', error);
            }
          }}
        />
        <Image src={thumbnail(photo.fileName)} h={200} />
      </Box>
    </Box>
  );
}
