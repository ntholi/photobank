'use client';
import React from 'react';

import { ResourcePage } from '@/app/(admin)/admin-core';
import { Avatar, Group, Text } from '@mantine/core';
import UserDetails from './UserDetails';
import { userRepository } from './repository';

export default function UserPage() {
  return (
    <ResourcePage
      resourceLabel='User'
      repository={userRepository}
      details={UserDetails}
      navLinkProps={(it) => ({
        label: (
          <Group>
            <Avatar src={it.image} alt={`${it.firstName} ${it.lastName}`} />
            <Text>
              {it.firstName} {it.lastName}
            </Text>
          </Group>
        ),
      })}
    ></ResourcePage>
  );
}
