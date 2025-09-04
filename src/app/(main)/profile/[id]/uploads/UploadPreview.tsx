'use client';

import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Progress } from '@heroui/progress';
import { Tooltip } from '@heroui/tooltip';
import { Image } from '@heroui/image';
import { MdCloudUpload, MdDelete, MdEdit } from 'react-icons/md';

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

  React.useEffect(() => {
    if (value) {
      setLoading(true);
      const url = URL.createObjectURL(value);
      const isVid = value.type.startsWith('video/');
      setPreviewUrl(url);
      setIsVideo(isVid);
      const t = setTimeout(() => setLoading(false), 200);
      return () => {
        clearTimeout(t);
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
      setIsVideo(false);
    }
  }, [value]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onChange(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
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
          'group ring-default-200 border ring-1 transition-colors ' +
          (dragging ? 'bg-primary/10 ring-primary' : '')
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
              <Tooltip content='Replace'>
                <Button
                  isIconOnly
                  variant='light'
                  size='sm'
                  onPress={() => inputRef.current?.click()}
                >
                  <MdEdit />
                </Button>
              </Tooltip>
              <Tooltip content='Remove'>
                <Button
                  isIconOnly
                  variant='light'
                  color='danger'
                  size='sm'
                  onPress={() => onChange(null)}
                >
                  <MdDelete />
                </Button>
              </Tooltip>
            </div>
          </CardHeader>
        )}
        <CardBody className='relative overflow-hidden p-0'>
          <div
            className='flex aspect-video items-center justify-center overflow-hidden'
            onClick={() => inputRef.current?.click()}
            role='button'
            tabIndex={0}
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
                  className='h-full w-full object-cover'
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
                  JPG, PNG, WEBP, or MP4/MOV/AVI up to 100MB
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
          </div>
        </CardBody>
        {!value && (
          <CardFooter className='justify-center py-3'>
            <Button
              color='primary'
              variant='flat'
              onPress={() => inputRef.current?.click()}
            >
              Choose file
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
