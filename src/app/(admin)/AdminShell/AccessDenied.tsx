import { Image, Stack, Title, Text, Button, Anchor } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function AccessDenied() {
  const { data: session } = useSession();
  return (
    <Stack align="center" justify="center" h={'100vh'}>
      <div>
        <Image
          src="/images/access-denied.png"
          h={300}
          w="auto"
          fit="contain"
          alt="Access Denied"
        />
      </div>
      <Title>Access Denied</Title>
      <Text>
        You are logged in as {session?.user?.name},{' '}
        <Anchor component="button" onClick={() => signOut()}>
          Sign Out
        </Anchor>
      </Text>
      <Button component={Link} href={'/'}>
        Home Page
      </Button>
    </Stack>
  );
}
