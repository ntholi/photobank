'use client';

import Image from 'next/image';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Divider } from '@nextui-org/react';

type InputType = {
  names: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const { register, handleSubmit } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const router = useRouter();

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/signup', data);
      if (res.data.user) {
        router.push(`/${res.data.user.username}`);
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
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {step === 0 && (
            <>
              <div className="space-y-3">
                <Button
                  variant="bordered"
                  className="border-zinc-700 w-full p-6 flex justify-start border-1 rounded-sm"
                  startContent={<FcGoogle size="1.4rem" />}
                >
                  Continue with Google
                </Button>
                <Button
                  variant="bordered"
                  className="border-zinc-700 w-full p-6 flex justify-start border-1 rounded-sm"
                  startContent={<FaFacebook color="#1877F2" size="1.4rem" />}
                >
                  Continue with Facebook
                </Button>
              </div>

              <div className="inline-flex items-center justify-center w-full">
                <Divider className="h-px my-8 " />
                <span className="absolute px-3 font-medium -translate-x-1/2 bg-white left-1/2 ">
                  OR
                </span>
              </div>
              <h3 className="text-default-500 ps-1 mb-2 text-small">
                Email and password
              </h3>
            </>
          )}
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="space-y-6">
              <Input
                type="email"
                variant="bordered"
                label="Email"
                isDisabled={step !== 0}
                {...register('email', { required: true })}
              />
              {step !== 0 && (
                <>
                  <Input
                    type="text"
                    variant="bordered"
                    label="Full Names"
                    {...register('names', { required: true, minLength: 3 })}
                  />
                  <Input
                    type="password"
                    variant="bordered"
                    required
                    label="Password"
                    {...register('password', { required: true, minLength: 6 })}
                  />
                </>
              )}

              <div>
                {step === 0 ? (
                  <Button
                    color="primary"
                    variant="solid"
                    onClick={() => setStep(1)}
                    type="button"
                    className="flex w-full p-6 justify-center rounded-md"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="solid"
                    type="submit"
                    isLoading={loading}
                    className="flex w-full justify-center"
                  >
                    Register
                  </Button>
                )}
              </div>
            </div>
          </form>

          <p
            className="mt-10 text-center text-sm text-gray-500"
            color="foreground"
          >
            Already registered?{' '}
            <Link href="/signin" size="sm" as={NextLink}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
