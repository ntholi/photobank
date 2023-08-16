import React from 'react';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';

export default function UploadPage() {
  return (
    <section className="flex flex-col justify-center items-center w-full h-screen">
      <Image src="/images/photo_session.svg" alt="photo upload " width={400} />
      <h1 className="text-lg font-semibold text-gray-600 mt-6">
        Upload Your Photo
      </h1>
      <p className="text-sm text-gray-400 sm:w-96 text-center">
        Please note that only photos related to Lesotho bla-bla will be
        accepted, all photos are subject to review before they can be published
        on the photo bank
      </p>
      <Button startContent={<GoUpload />} className="mt-6">
        Upload
      </Button>
    </section>
  );
}
