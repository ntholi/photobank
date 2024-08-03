'use client';
import { Button, Image, useDisclosure } from '@nextui-org/react';
import { ContributorApplication, Role } from '@prisma/client';
import axios from 'axios';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoCheck, GoUpload } from 'react-icons/go';
import UploadModal from './UploadModal';
import ContributorButton from './ContributorButton';
import { canUpload } from './utils';

type Props = { params: { username: string } };

export default function UploadPage({ params: { username } }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();

  if (!session?.user) return null;

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
        <ContributorButton username={username} onOpen={onOpen} />
      </section>
    </>
  );
}
