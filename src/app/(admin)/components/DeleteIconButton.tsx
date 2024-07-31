'use client';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { IconTrashFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';

type Props = {
  action: (id: any) => Promise<void>;
  id: number | string;
} & ActionIconProps;

export default function DeleteIconButton({ action, id, ...props }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      await action(id);
      router.back();
    });
  }
  return (
    <ActionIcon
      variant="light"
      color="red"
      loading={isPending}
      onClick={handleDelete}
      {...props}
    >
      <IconTrashFilled size={'1rem'} />
    </ActionIcon>
  );
}
