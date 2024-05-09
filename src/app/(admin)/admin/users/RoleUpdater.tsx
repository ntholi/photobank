'use client';
import { Checkbox, Group, LoadingOverlay } from '@mantine/core';
import React, { useTransition } from 'react';
import { userRepository } from './repository';
import { Role } from './model/user';
import { useSession } from '../../auth/SessionProvider';

type Props = {
  user: { id: string; roles: string[] };
};
export default function RoleUpdater({ user }: Props) {
  const { user: adminUser } = useSession();
  const [isPending, startTransition] = useTransition();
  const isAdmin = adminUser?.role === 'admin';

  async function updateUserRoles(id: string, roles: Role[]) {
    if (isAdmin) {
      await userRepository.updateRoles(id, roles as Role[]);
    }
  }

  return (
    <Checkbox.Group
      defaultValue={user.roles}
      label='Roles'
      description='Set user roles'
      onChange={(roles) =>
        startTransition(
          async () => await updateUserRoles(user.id, roles as Role[]),
        )
      }
    >
      <LoadingOverlay visible={isPending} />
      <Group mt='xs'>
        <Checkbox value='user' disabled label='User' />
        <Checkbox value='employee' label='Employee' disabled={!isAdmin} />
        <Checkbox value='admin' label='Admin' disabled={!isAdmin} />
      </Group>
    </Checkbox.Group>
  );
}
