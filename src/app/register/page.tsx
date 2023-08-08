'use client';

import Image from 'next/image';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';

type InputType = {
  names: string;
  email: string;
  password: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto w-auto"
            height={40}
            width={40}
            src="/images/logo.jpg"
            alt="Name of PhotoBank "
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            method="POST"
          >
            <Input
              type="text"
              variant="bordered"
              label="Full Names"
              {...register('names', { required: true, minLength: 3 })}
            />
            <Input
              type="email"
              variant="bordered"
              label="Email"
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
                Register
              </Button>
            </div>
          </form>

          <p
            className="mt-10 text-center text-sm text-gray-500"
            color="foreground"
          >
            Already registered?{' '}
            <Link href="/login" size="sm" as={NextLink}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
