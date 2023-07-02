import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import bcrypt from 'bcrypt';

async function registerAccount(data: FormData) {
  'use server';
  const names = data.get('names')?.valueOf() as string;
  const email = data.get('email')?.valueOf() as string;
  const password = data.get('password')?.valueOf() as string;

  function toUsername(str: string) {
    return str.replace(' ', '').toLowerCase();
  }

  if (!email || !password) {
    throw new Error('Missing Fields');
  }

  let firstName = names;
  let lastName = '';
  if (names && names.split(' ').length >= 2) {
    const namesArray = names.split(' ');
    firstName = namesArray.slice(0, namesArray.length - 1).join(' ');
    lastName = namesArray[namesArray.length - 1];
  }

  const exists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!exists) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: toUsername(names),
        email: email,
        firstName: firstName,
        lastName: lastName,
        hashedPassword: hashedPassword,
      },
    });

    console.log('User', user);
  }
}

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
            <div>
              <label
                htmlFor="names"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Names
              </label>
              <div className="mt-2">
                <input
                  id="names"
                  name="names"
                  type="text"
                  autoComplete="names"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already registered?{' '}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
