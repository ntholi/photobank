'use client';
import { getFile } from '@/lib/utils/indexedDB';
import { Image, Skeleton } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PhotoUploadForm from '../Form';
import axios, { AxiosProgressEvent } from 'axios';
import { Location } from '@prisma/client';

export default async function Page() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>();
  const [message, setMessage] = useState<'' | 'Uploading' | 'Processing Image'>(
    '',
  );
  const router = useRouter();

  useEffect(() => {
    const loadFile = async () => {
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
    loadFile();
  }, []);

  const handleFileUpload = async () => {
    if (file) {
      setProgress(0);
      setMessage('Uploading');
      const ext = file.name.split('.').pop();
      try {
        const { url, fileName } = (
          await axios.get(`/api/photos/upload-url?ext=${ext}`)
        ).data;

        await axios.put(url, file, {
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              setProgress((e.loaded / e.total) * 100);
            }
          },
        });
        if (fileName) {
          setMessage('Processing Image');
          setProgress(0);
          const { data } = await axios.post('/api/photos', {
            fileName,
          });

          router.push(`/upload/${data.photo.id}`);
        }
      } finally {
        setMessage('');
        setProgress(undefined);
      }
    }
  };

  async function handleSubmit(location?: Location, caption?: string) {
    await handleFileUpload();
  }

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
        <PhotoUploadForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
