'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { getFile } from '@/lib/utils/indexedDB';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import VideoEditor from './VideoEditor';
import VideoForm from './VideoForm';

export default function VideoUploadPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [video, setVideo] = useState<File | null>(null);
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadFile = async () => {
      try {
        const file = await getFile('uploadFile');
        if (file) {
          setVideo(file);
        } else {
          router.push('/upload');
        }
      } catch (error) {
        console.error(error);
        router.push('/upload');
      }
    };

    loadFile();
  }, [router]);

  const handleTrimComplete = (url: string) => {
    setTrimmedVideoUrl(url);
    setCurrentStep(2);
  };

  const goBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.push('/upload');
    }
  };

  return (
    <section className='mx-auto max-w-4xl px-4 md:mt-16'>
      <div className='my-8 flex items-center gap-4'>
        <Button
          isIconOnly
          variant='light'
          onClick={goBack}
          className='text-gray-500'
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className='text-xl font-semibold'>Upload Video</h1>
          <p className='text-sm text-gray-500'>
            Step {currentStep} of 2:{' '}
            {currentStep === 1 ? 'Edit Video' : 'Details'}
          </p>
        </div>
      </div>

      {currentStep === 1 ? (
        <VideoEditor videoFile={video} onNext={handleTrimComplete} />
      ) : (
        <VideoForm videoUrl={trimmedVideoUrl} />
      )}
    </section>
  );
}
