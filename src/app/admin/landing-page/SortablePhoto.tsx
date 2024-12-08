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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Box pos={'relative'}>
        <Image src={thumbnail(photo.fileName)} h={200} />
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
      </Box>
    </Box>
  );
}
