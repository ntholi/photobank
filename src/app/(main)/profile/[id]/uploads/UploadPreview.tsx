'use client';

import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Progress } from '@heroui/progress';
import { Tooltip } from '@heroui/tooltip';
import { Image } from '@heroui/image';
import {
  MdCloudUpload,
  MdDelete,
  MdRotate90DegreesCcw,
  MdRotateLeft,
  MdRotateRight,
} from 'react-icons/md';

const MAX_MB = 25;

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
};

export default function UploadPreview({ value, onChange }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isVideo, setIsVideo] = React.useState<boolean>(false);
  const [dragging, setDragging] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rotation, setRotation] = React.useState<number>(0);

  React.useEffect(() => {
    if (value) {
      setLoading(true);
      const url = URL.createObjectURL(value);
      const isVid = value.type.startsWith('video/');
      setPreviewUrl(url);
      setIsVideo(isVid);
      setRotation(0); // Reset rotation for new files
      const t = setTimeout(() => setLoading(false), 200);
      return () => {
        clearTimeout(t);
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
      setIsVideo(false);
      setRotation(0);
    }
  }, [value]);

  const validateFile = (f: File | null) => {
    if (!f) return { ok: true } as const;
    const maxBytes = MAX_MB * 1024 * 1024;
    const isAllowedType =
      f.type.startsWith('image/') || f.type.startsWith('video/');
    if (!isAllowedType) {
      return { ok: false, msg: 'Unsupported file type' } as const;
    }
    if (f.size > maxBytes) {
      return { ok: false, msg: `File is larger than ${MAX_MB}MB` } as const;
    }
    return { ok: true } as const;
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    const res = validateFile(f);
    if (!res.ok) {
      setError(res.msg);
      onChange(null);
      return;
    }
    setError(null);
    onChange(f);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    const res = validateFile(f);
    if (!res.ok) {
      setError(res.msg);
      onChange(null);
      return;
    }
    setError(null);
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
        className={
          'group ring-default-200 relative transition-colors ' +
          (dragging ? 'bg-primary/10 ring-primary' : 'bg-content1/30')
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {value && (
          <CardHeader className='flex items-center justify-between py-2'>
            <span className='text-default-500 truncate text-xs'>
              {value.name}
            </span>
            <div className='flex items-center gap-1'>
              {!isVideo && (
                <Tooltip content='Rotate'>
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    onPress={handleRotate}
                  >
                    <MdRotateRight size={'1rem'} />
                  </Button>
                </Tooltip>
              )}
              <Tooltip content='Remove'>
                <Button
                  isIconOnly
                  variant='light'
                  color='danger'
                  size='sm'
                  onPress={() => onChange(null)}
                >
                  <MdDelete size={'1rem'} />
                </Button>
              </Tooltip>
            </div>
          </CardHeader>
        )}
        <CardBody className='relative overflow-hidden p-0'>
          <div
            className={
              'flex aspect-video items-center justify-center overflow-hidden outline-none ' +
              (value
                ? 'cursor-pointer'
                : 'border-default-200 hover:border-default-400 cursor-pointer border-2 border-dashed transition-colors')
            }
            onClick={() => inputRef.current?.click()}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {previewUrl ? (
              isVideo ? (
                <video
                  src={previewUrl}
                  className='h-full w-full object-cover'
                  controls
                />
              ) : (
                <Image
                  removeWrapper
                  src={previewUrl}
                  alt='Preview'
                  className='h-full w-full object-cover transition-transform duration-300'
                  style={{
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              )
            ) : (
              <div className='flex h-full w-full flex-col items-center justify-center gap-2 text-center'>
                <div className='text-default-400'>
                  <MdCloudUpload size={40} />
                </div>
                <div className='text-default-700 text-sm'>
                  Drag & drop or click to upload
                </div>
                <div className='text-default-500 text-xs'>
                  JPG, PNG, WEBP, or MP4/MOV/AVI up to {MAX_MB}MB
                </div>
              </div>
            )}

            {loading && (
              <div className='bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm'>
                <Progress
                  isIndeterminate
                  aria-label='Loading'
                  className='w-1/2'
                />
              </div>
            )}

            {(dragging || isFocused) && !previewUrl && (
              <div className='border-primary/60 pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed' />
            )}
          </div>
        </CardBody>
        <CardFooter className='flex items-center justify-between gap-2 py-2'>
          {!value ? (
            <Button
              color='primary'
              variant='flat'
              onPress={() => inputRef.current?.click()}
              className='min-w-24'
            >
              Choose file
            </Button>
          ) : (
            <div className='text-default-500 flex items-center gap-2 text-xs'>
              <span className='rounded-medium bg-default-100 px-2 py-1'>
                {(value.type || 'unknown').split('/')[1] || 'file'}
              </span>
              <span className='rounded-medium bg-default-100 px-2 py-1'>
                {(value.size / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
          )}
          {error && (
            <span className='text-danger ml-auto truncate text-xs'>
              {error}
            </span>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
