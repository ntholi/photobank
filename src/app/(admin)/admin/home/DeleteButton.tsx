'use client';
import { ActionIcon, Box, BoxProps, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrashFilled } from '@tabler/icons-react';

type Props = {
  photo: {
    id: string;
    fileName: string;
  };
  handleDelete: (photoId: string) => Promise<void>;
} & BoxProps;

export default function DeleteButton({ photo, handleDelete, ...rest }: Props) {
  const openModal = () =>
    modals.openConfirmModal({
      title: 'Confirm Delete',
      children: (
        <Text size="sm">Are you sure you want to delete this photo?</Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(photo.id),
    });

  return (
    <Box {...rest}>
      <ActionIcon
        color="red"
        pos={'absolute'}
        top={5}
        right={5}
        variant="default"
        onClick={openModal}
      >
        <IconTrashFilled size={'1rem'} />
      </ActionIcon>
    </Box>
  );
}
