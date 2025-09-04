'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Alert } from '@heroui/alert';
import { Progress } from '@heroui/progress';
import UploadPreview from '@/app/(main)/profile/[id]/uploads/UploadPreview';
import LocationPicker from '@/app/(main)/profile/[id]/uploads/location-picker';
import { Textarea } from '@heroui/input';

type Props = {
  onSubmit: (values: {
    file: File;
    description?: string | null;
    locationData?: {
      placeId: string;
      name: string;
      address?: string | null;
      latitude: number;
      longitude: number;
    };
  }) => Promise<unknown>;
  submitting?: boolean;
};

export default function UploadForm({ onSubmit, submitting }: Props) {
  const [file, setFile] = React.useState<File | null>(null);
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState<
    | {
        placeId: string;
        name: string;
        address?: string | null;
        latitude: number;
        longitude: number;
      }
    | undefined
  >();
  const [error, setError] = React.useState<string | null>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/quicktime',
  ];

  const validateFile = (f: File) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return 'Invalid file type. Upload a JPG, PNG, WEBP image or an MP4/MOV/AVI/QuickTime video.';
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File is too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    }
    return null;
  };

  const handleFileSelect = (f: File | null) => {
    if (!f) {
      setFile(null);
      return;
    }
    const validation = validateFile(f);
    setError(validation);
    setFile(validation ? null : f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    await onSubmit({
      file,
      description: description || null,
      locationData: location,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <UploadPreview value={file} onChange={handleFileSelect} />

      {error && (
        <Alert color='danger' title='Cannot upload' variant='faded'>
          {error}
        </Alert>
      )}

      <LocationPicker
        label='Location (optional)'
        placeholder='Search a location'
        onLocationSelect={(sel: {
          placeId: string;
          name: string;
          address?: string | null;
          latitude: number;
          longitude: number;
        }) => setLocation(sel)}
      />

      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, 300))}
        rows={4}
        maxLength={300}
        placeholder='Describe your photo (optional)'
      />

      <div className='flex items-center gap-3'>
        <Button
          variant='flat'
          color='default'
          onPress={() => {
            setFile(null);
            setDescription('');
            setLocation(undefined);
            setError(null);
          }}
        >
          Reset
        </Button>
        <div className='flex-1' />
        <Button
          type='submit'
          color='primary'
          isDisabled={!file || submitting}
          isLoading={submitting}
        >
          {submitting ? 'Uploading…' : 'Upload'}
        </Button>
      </div>

      {submitting && <Progress aria-label='Uploading' isIndeterminate />}
    </form>
  );
}
