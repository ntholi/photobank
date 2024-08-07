'use client';

import { ActionIcon, Menu, Text } from '@mantine/core';
import { Role, User } from '@prisma/client';
import {
  IconCheck,
  IconDotsVertical,
  IconHandStop,
  IconLockOpen,
} from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { blockUser, updateRole } from './actions';
import { modals } from '@mantine/modals';

type Props = {
  user: User;
};

export default function RowActions({ user }: Props) {
  const [blocked, setBlocked] = React.useState(user.blocked);

  const openModal = (actionName: string, onConfirm: () => void) =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          Are you sure you want to {actionName.toLowerCase()} this user?
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: onConfirm,
    });

  useEffect(() => {
    setBlocked(user.blocked);
  }, [user]);

  const handleBlock = async () => {
    const res = await blockUser(user.id, !blocked);
    if (res) setBlocked(!blocked);
  };

  const handleRole = async (role: Role) => {
    openModal(`update role to ${role} for`, () => updateRole(user.id, role));
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
        <Menu.Divider />

        <Menu.Label>Update Role</Menu.Label>
        {Object.keys(Role).map((role) => (
          <RoleItem key={role} user={user} role={role as Role} />
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

function RoleItem({ user, role }: { user: User; role: Role }) {
  return (
    <Menu.Item
      onClick={() => updateRole(user.id, role)}
      rightSection={user.role == role && <IconCheck size="1rem" />}
    >
      <Text size="xs">{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
    </Menu.Item>
  );
}
