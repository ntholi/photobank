'use client';

import React from 'react';
import { Button } from '@heroui/button';
import UploadPreview from '@/app/(main)/profile/[id]/uploads/UploadPreview';
import LocationPicker from '@/app/(main)/profile/[id]/uploads/location-picker';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await onSubmit({
      file,
      description: description || null,
      locationData: location,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <UploadPreview value={file} onChange={setFile} />

      <LocationPicker
        label='Location'
        placeholder='Search a location'
        onLocationSelect={(sel: {
          placeId: string;
          name: string;
          address?: string | null;
          latitude: number;
          longitude: number;
        }) => setLocation(sel)}
      />

      <div>
        <label className='mb-1 block text-sm font-medium'>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder='Say something about this photo'
          className='border-default-300 bg-default-50 text-default-900 placeholder-default-500 focus:border-primary focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-1'
        />
      </div>

      <div className='flex gap-3'>
        <Button
          type='submit'
          color='primary'
          isDisabled={!file || submitting}
          isLoading={submitting}
          className='flex-1'
        >
          {submitting ? 'Uploading…' : 'Upload'}
        </Button>
      </div>
    </form>
  );
}
