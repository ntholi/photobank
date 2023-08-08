import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { registerAccount } from './actions';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';

export default function Register() {
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
          <form action={registerAccount} className="space-y-6" method="POST">
            <Input
              type="text"
              variant="bordered"
              label="Full Names"
              name="names"
            />
            <Input type="email" variant="bordered" label="Email" name="email" />
            <Input
              type="password"
              variant="bordered"
              label="Password"
              name="password"
            />

            <div>
              <Button
                color="primary"
                variant="solid"
                className="flex w-full justify-center"
              >
                Register
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
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
