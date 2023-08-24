import Link from 'next/link';
import Image from 'next/image';
import { BsTwitter, BsFacebook, BsInstagram } from 'react-icons/bs';
import { APP_NAME } from '@/lib/constants';

export default function Footer({ className }: { className?: string }) {
  const logoHeight = 25;
  return (
    <footer className={`bg-gray-100 border-t ${className}`}>
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Image
              src={`/images/logo.jpg`}
              width={logoHeight * 3.22}
              height={logoHeight}
              alt="logo"
            />

            <p className="mt-4 max-w-xs text-gray-500">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse non
              cupiditate quae nam molestias.
            </p>

            <ul className="mt-8 flex gap-6">
              <li>
                <Link
                  href="/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Facebook</span>
                  <BsFacebook />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Instagram</span>
                  <BsInstagram />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Twitter</span>
                  <BsTwitter />
                </Link>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium text-gray-900">Services</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Directory
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Advertising Opportunities
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Article Publications
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Subscription Plans
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900">Company</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Meet the Team
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900">Helpful Links</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    FAQs
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Terms of Service
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900">Legal</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Copyright Notice
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Disclaimer
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Cookie Policy
                  </Link>
                </li>

                <li>
                  <Link
                    href="#"
                    className="text-gray-700 transition hover:opacity-75"
                  >
                    Anti-Spam Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()}. {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
