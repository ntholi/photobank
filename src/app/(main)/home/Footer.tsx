'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';
import { isExcludePath } from '../base/excludePaths';
import { cn } from '@nextui-org/react';

export default function Footer({ className }: { className?: string }) {
  const logoHeight = 35;
  const pathname = usePathname();

  if (isExcludePath(pathname)) {
    return null;
  }

  return (
    <footer className={cn(`border-t bg-gray-100`, className)}>
      <div className='mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div>
            <Image
              src={`/images/logo/transparent.png`}
              width={logoHeight * 3.22}
              height={logoHeight}
              alt='logo'
            />

            <p className='max-w-xs text-gray-500'>
              Lehakoe is Lesotho's Photobank and Virtual Tour platform. The
              platform is designed to promote tourism and showcase the beauty of
              Lesotho
            </p>

            <ul className='mt-8 flex gap-6'>
              <li>
                <Link
                  href='/'
                  rel='noreferrer'
                  target='_blank'
                  className='text-gray-700 transition hover:opacity-75'
                >
                  <span className='sr-only'>Facebook</span>
                  <BsFacebook />
                </Link>
              </li>

              <li>
                <Link
                  href='/'
                  rel='noreferrer'
                  target='_blank'
                  className='text-gray-700 transition hover:opacity-75'
                >
                  <span className='sr-only'>Instagram</span>
                  <BsInstagram />
                </Link>
              </li>

              <li>
                <Link
                  href='/'
                  rel='noreferrer'
                  target='_blank'
                  className='text-gray-700 transition hover:opacity-75'
                >
                  <span className='sr-only'>Twitter</span>
                  <BsTwitter />
                </Link>
              </li>
            </ul>
          </div>

          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4'>
            <div>
              <p className='font-medium text-gray-900'>Services</p>

              <ul className='mt-6 space-y-4 text-sm'>
                <li>
                  <Link
                    href='#/gallery'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Photos
                  </Link>
                </li>

                <li>
                  <Link
                    href='/virtual-tours'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Virtual Tours
                  </Link>
                </li>

                <li>
                  <Link
                    href='#/gallery'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Map
                  </Link>
                </li>

                <li>
                  <Link
                    href='#'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Prices
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className='font-medium text-gray-900'>Organization</p>

              <ul className='mt-6 space-y-4 text-sm'>
                <li>
                  <Link
                    href='/content/about'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href='https://ltdc.org.ls/'
                    target='_blank'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    LTDC
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className='font-medium text-gray-900'>Helpful Links</p>

              <ul className='mt-6 space-y-4 text-sm'>
                <li>
                  <Link
                    href='/content/faqs'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    FAQs
                  </Link>
                </li>

                <li>
                  <Link
                    href='/content/terms-of-service'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Terms of Service
                  </Link>
                </li>

                <li>
                  <Link
                    href='/content/privacy-policy'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className='font-medium text-gray-900'>Legal</p>

              <ul className='mt-6 space-y-4 text-sm'>
                <li>
                  <Link
                    href='/content/copyright-notice'
                    className='text-gray-700 transition hover:opacity-75'
                  >
                    Copyright Notice
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className='text-xs text-gray-500'>
          &copy; {new Date().getFullYear()}. Lesotho Tourism Development
          Corporation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
