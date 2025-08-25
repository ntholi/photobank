'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
};

export default function UploadPreview({ value, onChange }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isVideo, setIsVideo] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setIsVideo(value.type.startsWith('video/'));
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      setIsVideo(false);
    }
  }, [value]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onChange(f);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        accept='image/*,video/*'
        className='hidden'
        onChange={handleSelect}
      />
      <Card
        isPressable
        onPress={() => inputRef.current?.click()}
        className='border-default-200 border'
      >
        <CardBody className='flex aspect-video items-center justify-center overflow-hidden p-0'>
          {previewUrl ? (
            isVideo ? (
              <div className='text-default-600 text-sm'>Video selected</div>
            ) : (
              <Image
                removeWrapper
                src={previewUrl}
                alt='Preview'
                className='h-full w-full object-cover'
              />
            )
          ) : (
            <div className='text-default-500 text-sm'>
              Tap to select a photo or video
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
