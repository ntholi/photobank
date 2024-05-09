'use client';
import { auth } from '@/lib/config/firebase';
import { Button, Paper, Stack } from '@mantine/core';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import Logo from '../../AdminShell/Logo';

function SignInPage() {
  const router = useRouter();

  function handleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        router.push('/admin');
      })
      .catch((error) => {
        console.error({ error });
      });
  }
  return (
    <Stack p={'md'} h={'100vh'} w={'100vw'} align={'center'} justify='center'>
      <Paper p={60} withBorder shadow='sm'>
        <Logo size={'sm'} />
        <Stack mt={'lg'} align={'center'} justify={'center'}>
          <Button
            mt={'lg'}
            variant='default'
            leftSection={<IconBrandGoogleFilled />}
            onClick={handleSignIn}
          >
            Continue with Google
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default SignInPage;
