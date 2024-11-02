'use client';
import React, { useState } from 'react';
import UploadForm from '../Form';
import { Location } from '@prisma/client';
import axios, { AxiosProgressEvent } from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface VideoFormProps {
  videoUrl: string | null;
  isSaving?: boolean;
}

export default function VideoForm({ videoUrl, isSaving }: VideoFormProps) {
  const [progress, setProgress] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const session = useSession();

  const handleFileUpload = async (videoUrl: string) => {
    setProgress(0);
    setError(null);

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const file = new File([blob], 'video.mp4', { type: 'video/mp4' });

      const { url, fileName } = (await axios.get(`/api/videos/upload-url`))
        .data;

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
    }
  };

  async function handleSubmit(location?: Location, description?: string) {
    if (!videoUrl) return;

    setError(null);
    try {
      const fileName = await handleFileUpload(videoUrl);

      await axios.post('/api/videos', {
        fileName,
        location,
        description,
      });

      router.push(`/users/${session.data?.user?.id}`);
    } catch (error) {
      console.error('Error uploading video:', error);
      if (axios.isAxiosError(error)) {
        setError(
          `Failed to save video: ${error.response?.data.message || error.message}`,
        );
      } else {
        setError('An unexpected error occurred while saving the video.');
      }
    }
  }

  return (
    <section className='grid gap-5 lg:grid-cols-2'>
      <div>
        {videoUrl && <video src={videoUrl} controls className='w-full' />}
      </div>
      <div>
        <UploadForm
          onSubmit={handleSubmit}
          progress={progress}
          isSaving={isSaving}
        />
        {error && (
          <div className='mt-4 rounded-md bg-red-100 p-4 text-sm text-red-700'>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
