import { auth } from '@/lib/config/firebase';
import { Image, Stack, Title, Text, Button, Anchor } from '@mantine/core';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import React from 'react';
import { useSession } from '../auth/SessionProvider';

export default function AccessDenied() {
  const { user } = useSession();
  return (
    <Stack align='center' justify='center' h={'100vh'}>
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
      <Text>
        You are logged in as {user?.displayName},{' '}
        <Anchor component='button' onClick={() => signOut(auth)}>
          Sign Out
        </Anchor>
      </Text>
      <Button component={Link} href={'/'}>
        Home Page
      </Button>
    </Stack>
  );
}
