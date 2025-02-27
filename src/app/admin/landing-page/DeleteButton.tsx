'use client';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface DeleteButtonProps extends ActionIconProps {
  photo: {
    id: string;
  };
  handleDelete: () => Promise<void>;
}

export default function DeleteButton({
  photo,
  handleDelete,
  ...props
}: DeleteButtonProps) {
  const onDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleDelete();
  };

  return (
    <ActionIcon
      variant='filled'
      color='red'
      onMouseDown={onDelete}
      {...props}
      style={{ touchAction: 'none' }}
    >
      <IconTrash size={16} />
    </ActionIcon>
  );
}
