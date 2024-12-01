'use client';
import { Button, Image, Stack, Text, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AccessDenied() {
  const { data: session } = useSession();
  return (
    <Stack align='center' justify='center' h={'80vh'}>
      <div>
        <Image
          src='/images/access-denied.png'
          h={300}
          w='auto'
          fit='contain'
          alt='Access Denied'
        />
      </div>
      <Title>Access Denied</Title>
      <Text>You are logged in as {session?.user?.name}</Text>
      <Button component={Link} href={'/'} variant='light'>
        Take Me Home
      </Button>
    </Stack>
  );
}
