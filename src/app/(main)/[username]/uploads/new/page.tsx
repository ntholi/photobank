'use client';
import React, { useEffect } from 'react';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';
import { useDisclosure } from '@nextui-org/modal';
import UploadModal from './UploadModal';
import axios from 'axios';

type UploadURL = {
  uploadURL: string;
  id: string;
};

export default function UploadPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploadUrl, setUploadUrl] = React.useState<UploadURL | null>();

  useEffect(() => {
    axios.get('/api/cloudflare/upload-url').then((res) => {
      if (res.data.uploadURL) {
        setUploadUrl(res.data.uploadURL as UploadURL);
        console.log(res.data.uploadURL);
      }
    });
  }, []);

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
          Please note that only photos related to Lesotho bla-bla will be
          accepted, all photos are subject to review before they can be
          published on the photo bank
        </p>
        <Button
          onPress={onOpen}
          startContent={<GoUpload />}
          color="primary"
          className="mt-5"
        >
          Upload
        </Button>
      </section>
    </>
  );
}
