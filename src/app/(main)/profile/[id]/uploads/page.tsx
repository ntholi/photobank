'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
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
      <Card shadow='sm' className='border-default-200 border'>
        <CardHeader className='text-lg font-medium'>Upload a Photo</CardHeader>
        <CardBody>
          <UploadForm
            onSubmit={handleSubmit}
            submitting={createMutation.isPending}
          />
        </CardBody>
      </Card>
    </div>
  );
}
