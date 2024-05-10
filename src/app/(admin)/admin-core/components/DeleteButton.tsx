'use client';

import { ActionIcon, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrashFilled } from '@tabler/icons-react';
import { useTransition } from 'react';

type Props = {
  disabled?: boolean;
  onClick?: () => Promise<void>;
};

export default function DeleteButton({ disabled, onClick }: Props) {
  const [isPending, startTransition] = useTransition();

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Conform Delete',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        startTransition(async () => {
          if (onClick) {
            await onClick();
          }
        });
      },
    });

  return (
    <ActionIcon
      color="red"
      variant="light"
      title="Delete"
      aria-label="Delete"
      disabled={disabled}
      loading={isPending}
      onClick={openDeleteModal}
    >
      <IconTrashFilled size={'1rem'} stroke={1.5} />
    </ActionIcon>
  );
}
