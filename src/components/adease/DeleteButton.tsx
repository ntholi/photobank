'use client';
import { ActionIcon, ActionIconProps, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrashFilled } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export interface DeleteButtonProps extends ActionIconProps {
  handleDelete: () => Promise<void>;
  message?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  queryKey?: string[];
}

export function DeleteButton({
  handleDelete,
  message,
  onSuccess,
  onError,
  queryKey,
  ...props
}: DeleteButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
        refetchType: 'all',
      });
      if (onSuccess) {
        onSuccess();
      } else {
        notifications.show({
          title: 'Success',
          message: 'Item deleted successfully',
          color: 'green',
        });
        router.back();
      }
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'An error occurred while deleting',
        color: 'red',
      });
      onError?.(error);
    },
  });

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Confirm Delete',
      children: (
        <Text size='sm'>
          {message || 'Are you sure you want to delete this'}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => mutation.mutate(),
    });

  return (
    <ActionIcon
      color='red'
      loading={mutation.isPending}
      onClick={openModal}
      {...props}
    >
      <IconTrashFilled size={'1rem'} />
    </ActionIcon>
  );
}
