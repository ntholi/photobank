'use client';
import { getFile } from '@/lib/utils/indexedDB';
import { Image, Skeleton, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import UploadForm from '../Form';
import axios, { AxiosProgressEvent } from 'axios';
import { Location } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { IconX, IconRotateClockwise } from '@tabler/icons-react';

export default function Page() {
  const [file, setFile] = useState<File>();
  const [rotation, setRotation] = useState(0);
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

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFileUpload = async () => {
    if (file) {
      setProgress(0);
      setError(null);
      const ext = file.name.split('.').pop();
      try {
        let fileToUpload = file;

        if (rotation !== 0) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new window.Image();

          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = URL.createObjectURL(file);
          });

          const isVertical = rotation === 90 || rotation === 270;
          canvas.width = isVertical ? img.height : img.width;
          canvas.height = isVertical ? img.width : img.height;

          if (ctx) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
          }

          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((blob) => resolve(blob!), `image/${ext}`),
          );

          fileToUpload = new File([blob], file.name, { type: file.type });
        }

        const { url, fileName } = (
          await axios.get(`/api/photos/upload-url?ext=${ext}`)
        ).data;

        await axios.put(url, fileToUpload, {
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
          await axios.post('/api/photos/uploads', {
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
      console.error('File upload failed:', error);
    }
  }

  return (
    <section className='grid gap-5 pt-5 md:mt-8 md:px-16 lg:grid-cols-2'>
      <div className='relative aspect-square w-full overflow-hidden rounded-lg border-2 border-dotted border-default-200 bg-gray-50 p-2'>
        {file ? (
          <>
            <div className='relative h-full w-full'>
              <img
                src={URL.createObjectURL(file)}
                alt={'Uploaded Image'}
                className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain'
                style={{
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                }}
              />
            </div>
            <Button
              isIconOnly
              className='absolute right-2 top-2 z-50'
              onClick={handleRotate}
              size='sm'
            >
              <IconRotateClockwise size={'1.2rem'} />
            </Button>
          </>
        ) : (
          <Skeleton className='h-full w-full' />
        )}
      </div>
      <div>
        <UploadForm
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
