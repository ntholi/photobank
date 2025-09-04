'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { Link } from '@heroui/link';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { uploadContentFile } from '@/server/content/uploadActions';
import { createContent } from '@/server/content/actions';
import UploadForm from '@/app/(main)/profile/[id]/uploads/UploadForm';

export default function UploadsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const createMutation = useMutation({
    mutationFn: createContent,
  });

  const errorMessage = createMutation.isError
    ? createMutation.error instanceof Error
      ? createMutation.error.message
      : 'Something went wrong while creating your post.'
    : null;

  const handleSubmit = async (values: {
    description?: string | null;
    locationData?: {
      placeId: string;
      name: string;
      address?: string | null;
      latitude: number;
      longitude: number;
    };
    file: File;
  }) => {
    const formData = new FormData();
    formData.append('file', values.file);
    const upload = await uploadContentFile(formData);

    const created = await createMutation.mutateAsync({
      userId,
      description: values.description ?? null,
      s3Key: upload.key,
      thumbnailKey: upload.thumbnailKey,
      watermarkedKey: upload.watermarkedKey,
      fileName: upload.fileName,
      fileSize: upload.fileSize,
      type: values.file.type.startsWith('image/') ? 'image' : 'video',
      status: 'published',
      contentLabels: upload.contentLabels,
      locationData: values.locationData,
      selectedTags: upload.selectedTags,
    });

    if (created?.id) router.push(`/content/${created.id}`);
    return created;
  };

  return (
    <div className='mx-auto max-w-2xl px-4 py-8'>
      <div className='mb-5'>
        <Link href={`/profile/${userId}`} size='sm' color='foreground'>
          ← Back to profile
        </Link>
        <h1 className='mt-2 text-2xl font-semibold tracking-tight'>
          Upload a photo
        </h1>
        <p className='text-default-500 mt-1 text-sm'>
          Share a high‑quality image that showcases Lesotho. Supported: images
          or video. A watermark preview will be generated.
        </p>
      </div>

      <Card className='relative'>
        {createMutation.isPending && (
          <div className='bg-background/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-sm'>
            <Spinner size='lg' color='primary' />
            <p className='text-default-600 text-sm'>
              Uploading and processing…
            </p>
          </div>
        )}
        <CardBody>
          {errorMessage && (
            <p role='alert' className='text-danger mb-3 text-sm'>
              {errorMessage}
            </p>
          )}

          <UploadForm
            onSubmit={handleSubmit}
            submitting={createMutation.isPending}
          />
        </CardBody>
      </Card>
    </div>
  );
}
