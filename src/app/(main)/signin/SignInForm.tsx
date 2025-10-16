'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@heroui/button';
import React, { useState } from 'react';
import { IconBrandGoogle } from '@tabler/icons-react';

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google');
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      {error && (
        <div className='rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400'>
          {error}
        </div>
      )}

      <Button
        fullWidth
        size='lg'
        onPress={handleSignIn}
        isLoading={isLoading}
        disabled={isLoading}
        className='bg-white font-semibold text-black shadow-md hover:bg-gray-100'
        startContent={!isLoading && <IconBrandGoogle size={20} stroke={2} />}
      >
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Button>
    </div>
  );
}
