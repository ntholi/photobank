import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import SignInForm from './SignInForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Lehakoe',
  description: 'Sign in to your Lehakoe account',
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect(`/profile/${session.user.id}`);
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl' />
        <div className='absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl' />
      </div>

      <div className='w-full max-w-md px-6'>
        <div className='mb-12 text-center'>
          <h1 className='from-foreground to-foreground/70 mb-3 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent'>
            Lehakoe
          </h1>
          <p className='text-foreground/60 text-lg'>
            Discover the beauty of Lesotho
          </p>
        </div>

        <div className='rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/20'>
          <p className='text-foreground/60 mb-8'>
            Sign in with your Google account to continue
          </p>

          <SignInForm />
        </div>

        <div className='text-foreground/50 mt-8 text-center text-sm'>
          <p>
            By signing in, you agree to our{' '}
            <a href='#' className='hover:text-foreground/70 transition-colors'>
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
