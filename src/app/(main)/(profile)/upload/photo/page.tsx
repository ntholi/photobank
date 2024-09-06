'use client';
import { getFile } from '@/lib/utils/indexedDB';
import { Image, Skeleton, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import PhotoUploadForm from '../Form';
import axios, { AxiosProgressEvent } from 'axios';
import { Location } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { IconX } from '@tabler/icons-react';

export default function Page() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>();
  const [isSaving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
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
        setError('Failed to load the file. Please try uploading again.');
      }
    };
    loadFile();
  }, []);

  const handleFileUpload = async () => {
    if (file) {
      setProgress(0);
      setError(null);
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
        setProgress(0);
        return fileName;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`File upload failed: ${error.message}`);
        } else {
          setError('An unexpected error occurred during file upload.');
        }
        throw error;
      } finally {
        setProgress(undefined);
      }
    }
  };

  async function handleSubmit(location?: Location, description?: string) {
    setError(null);
    try {
      const fileName = await handleFileUpload();
      startSaving(async () => {
        try {
          await axios.post('/api/photos', {
            fileName,
            location,
            description,
          });
          router.push(`/users/${session.data?.user?.id}`);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setError(
              `Failed to save photo: ${error.response?.data.message || error.message}`,
            );
          } else {
            setError('An unexpected error occurred while saving the photo.');
          }
        }
      });
    } catch (error) {
      // File upload error is already handled in handleFileUpload
      console.error('File upload failed:', error);
    }
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
        <PhotoUploadForm
          onSubmit={handleSubmit}
          progress={progress}
          isSaving={isSaving}
        />
        {error && (
          <div className='mt-4 flex items-center justify-between rounded-md bg-red-100 p-4 text-red-700'>
            <p className='text-sm'>{error}</p>
            <Button
              isIconOnly
              onClick={() => setError(null)}
              size='sm'
              variant='light'
            >
              <IconX size={'1.2rem'} />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
