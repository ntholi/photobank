'use client';

import { ActionIcon, Menu, Text } from '@mantine/core';
import { User } from '@prisma/client';
import {
  IconDotsVertical,
  IconHandStop,
  IconLockOpen,
} from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { blockUser } from './actions';

type Props = {
  user: User;
};
export default function RowActions({ user }: Props) {
  const [blocked, setBlocked] = React.useState(user.blocked);

  useEffect(() => {
    setBlocked(user.blocked);
  }, [user]);

  const handleBlock = async () => {
    const res = await blockUser(user.id, !blocked);
    if (res) setBlocked(!blocked);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconDotsVertical stroke={3} size={'1rem'} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item leftSection={<IconLockOpen size={'0.9rem'} />}>
          <Text size="xs">Reset Password</Text>
        </Menu.Item>
        <Menu.Item
          leftSection={<IconHandStop size={'0.9rem'} />}
          onClick={handleBlock}
        >
          <Text size="xs">{blocked ? 'Unblock' : 'Block'} Account</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
