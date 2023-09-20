'use client';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';
import { useDisclosure } from '@nextui-org/modal';
import UploadModal from './UploadModal';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';

export default function UploadPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { status, data: session } = useSession();

  if (status === 'loading') return null;

  return (
    <>
      <UploadModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <section className="flex flex-col justify-center items-center w-full h-screen">
        <Image
          src="/images/photo_session.svg"
          alt="photo upload "
          width={400}
        />
        <h1 className="text-2xl font-semibold text-gray-700 mt-8">
          Upload Your Photo
        </h1>
        <p className="text-sm text-gray-500 sm:w-96 text-center my-4">
          {canUpload(session?.user)
            ? 'Please note that all photos are subject to review before they can be published on the photo bank'
            : 'You have to be a contributor to upload photos'}
        </p>
        {canUpload(session?.user) ? (
          <Button
            onPress={onOpen}
            startContent={<GoUpload />}
            color="primary"
            className="mt-5"
          >
            Upload
          </Button>
        ) : (
          <Link as={NextLink} href="#">
            Become a Contributor
          </Link>
        )}
      </section>
    </>
  );
}

function canUpload(user: User | undefined) {
  return (
    user?.role === 'contributor' ||
    user?.role === 'admin' ||
    user?.role === 'moderator'
  );
}
