'use client';

import { APP_NAME, profilePath } from '@/lib/constants';
import { Button, Input, Link } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type InputType = {
  names: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit, setValue, setFocus } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (session) {
      router.push(profilePath(session.user));
    }
  }, [session]);

  useEffect(() => {
    if (email) {
      setValue('email', email);
      setFocus('password');
    }
  }, [email, setValue, setFocus]);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    try {
      setError('');
      const res = await signIn('credentials', { ...data, redirect: false });
      if (res?.error) {
        setError(res.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto w-auto"
            height={80}
            width={80}
            src="/images/logo/black.png"
            alt={APP_NAME}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="space-y-6">
              <Input
                type="email"
                variant="bordered"
                label="Email"
                errorMessage={error}
                {...register('email', { required: true })}
              />
              <Input
                type="password"
                variant="bordered"
                required
                label="Password"
                {...register('password', { required: true, minLength: 6 })}
              />

              <div>
                <Button
                  color="primary"
                  variant="solid"
                  type="submit"
                  isLoading={loading}
                  className="flex w-full justify-center"
                >
                  Sing In
                </Button>
              </div>
            </div>
          </form>

          <p
            className="mt-10 text-center text-sm text-gray-500"
            color="foreground"
          >
            {"Don't have an account? "}
            <Link href="/signup" size="sm" as={NextLink}>
              Sing Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
