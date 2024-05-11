'use client';

import { ActionIcon, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrashFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type Props = {
  disabled?: boolean;
  id?: string | number;
  baseUrl?: string;
  onClick?: (id: string | number) => Promise<void>;
};

export default function DeleteButton(props: Props) {
  const { disabled, id, baseUrl, onClick } = props;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Conform Delete',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        startTransition(async () => {
          if (id && onClick) {
            await onClick(id);
            if (baseUrl) {
              router.push(baseUrl);
            } else router.back();
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
