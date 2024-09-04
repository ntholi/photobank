'use client';
import { Image, Skeleton } from '@nextui-org/react';
import PhotoUploadForm from '../Form';
import prisma from '@/lib/prisma';
import { thumbnail } from '@/lib/config/urls';
import { notFound, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getFile } from '@/lib/utils/indexedDB';

type Props = { params: { photoId: string } };

export default async function Page({ params: { photoId } }: Props) {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const file = await getFile('uploadFile');
        if (file) {
          const url = URL.createObjectURL(file);
          setFile(file);
        } else {
          router.push('/upload');
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadVideo();
  }, []);

  return (
    <section className='grid gap-5 pt-5 md:mt-8 md:px-16 lg:grid-cols-2'>
      <div>
        {file ? (
          <Image
            src={URL.createObjectURL(file)}
            alt={'Uploaded Image'}
            shadow='sm'
          />
        ) : (
          <Skeleton />
        )}
      </div>
      <div>
        <PhotoUploadForm />
      </div>
    </section>
  );
}
