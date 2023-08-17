'use client';

import Image from 'next/image';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/config/firebase';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Divider } from '@nextui-org/react';

type InputType = {
  names: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    try {
      const { email, password } = data;
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      router.push(`/profile/${user.uid}`);
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
