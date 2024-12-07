'use client';
import { Group, Select, Text } from '@mantine/core';
import { Role } from '@prisma/client';
import React from 'react';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';

const roles = [
  { value: '', label: 'All Roles' },
  ...Object.keys(Role).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
  })),
];

export default function UserFilter() {
  const [role, setRole] = useQueryState('role');
  const router = useRouter();

  function roleChanged(role: string | null) {
    if (role) {
      router.replace('/admin/users?role=' + role);
    } else {
      router.replace('/admin/users');
    }
  }

  return (
    <Group>
      <Text c="dimmed">Filter</Text>
      <Select
        data={roles}
        placeholder="All Roles"
        value={role}
        onChange={(value) => roleChanged(value)}
      />
    </Group>
  );
}
