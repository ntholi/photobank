'use client';
import { Image, useDisclosure } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import ContributorButton from './ContributorButton';
import UploadModal from './UploadModal';
import { canUpload } from './utils';

export default function UploadPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <>
      <UploadModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <section className='flex h-screen w-full flex-col items-center justify-center'>
        <Image
          src='/images/photo_session.svg'
          alt='photo upload '
          width={400}
        />
        <h1 className='mt-8 text-2xl font-semibold text-gray-700'>
          Upload Your Photo
        </h1>
        <p className='my-4 text-center text-sm text-gray-500 sm:w-96'>
          {canUpload(session?.user)
            ? 'Please note that all photos are subject to review before they can be published on the photo bank'
            : 'You have to be a contributor to upload photos'}
        </p>
        <ContributorButton onOpen={onOpen} />
      </section>
    </>
  );
}
