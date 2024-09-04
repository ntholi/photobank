'use client';
import { Button, Image } from '@nextui-org/react';
import { IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { BiSolidCloudUpload } from 'react-icons/bi';

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function ImageInput({ file, setFile }: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState<null | 'image' | 'video'>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type.startsWith('video/')) {
        setFileType('video');
      } else {
        setFileType(null);
      }
      setFile(file);
    }
  };

  return (
    <>
      <input
        type='file'
        name='Picture/Video'
        accept='image/*,video/*'
        ref={fileRef}
        onChange={handleFileChange}
        hidden
      />
      {file ? (
        <div className='relative'>
          <Button
            className={
              'absolute right-1.5 top-1.5 z-50 border-1 border-zinc-500 bg-white bg-opacity-25 hover:bg-opacity-50'
            }
            isIconOnly
            radius='full'
            aria-label='Remove'
            onClick={() => setFile(null)}
          >
            <IconX size='1rem' />
          </Button>
          {fileType === 'image' && (
            <Image
              src={URL.createObjectURL(file)}
              alt='preview'
              className={'h-full w-full rounded-xl object-cover'}
            />
          )}
          {fileType === 'video' && (
            <video
              src={URL.createObjectURL(file)}
              className={'h-full w-full rounded-xl object-cover'}
            />
          )}
        </div>
      ) : (
        <div
          className={
            'flex h-full cursor-pointer flex-col items-center justify-center'
          }
          onClick={() => fileRef.current?.click()}
        >
          <BiSolidCloudUpload size='3rem' />
          <p className='text-sm text-gray-500'>Click here to upload an image</p>
        </div>
      )}
    </>
  );
}
