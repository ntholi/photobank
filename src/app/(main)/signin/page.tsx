'use client';

import Image from 'next/image';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

type InputType = {
  names: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  if (session) {
    router.push(`/${session?.user?.username}`);
  }

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
            src="/images/logo.jpg"
            alt="PhotoBank Logo"
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
            <Link href="/singup" size="sm" as={NextLink}>
              Sing Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const login = async (email: string, password: string) => {};
