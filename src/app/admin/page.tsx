'use client';
import { Stack, Title, Text } from '@mantine/core';
import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminPage() {
  return (
    <Stack h={'70vh'} w={'100%'} justify='center' align='center'>
      <div>
        <Title fw={'lighter'}>Admin Panel</Title>
        <Suspense fallback={<Text>...</Text>}>
          <UserDisplay />
        </Suspense>
      </div>
    </Stack>
  );
}

function UserDisplay() {
  const { data: session } = useSession();
  return (
    <Text size='sm' mt='xs'>
      Welcome, {session?.user?.name}
    </Text>
  );
}
