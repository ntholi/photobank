'use client';
import { getFile } from '@/lib/utils/indexedDB';
import { Image, Skeleton } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PhotoUploadForm from '../Form';

export default async function Page() {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const file = await getFile('uploadFile');
        if (file) {
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
