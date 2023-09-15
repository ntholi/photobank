'use client';
import React from 'react';
import { Button } from '@nextui-org/button';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { Image } from '@nextui-org/image';
import { IconX } from '@tabler/icons-react';

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  isLoading?: boolean;
};
export default function ImageInput({ file, setFile, isLoading }: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
    else setFile(null);
  };

  console.log('file', file);

  return (
    <>
      <input
        type="file"
        name="picture"
        ref={fileRef}
        onChange={handleFileChange}
        hidden
      />
      {file ? (
        <div className="relative">
          <Button
            className={
              'absolute top-1.5 right-1.5 z-50 border-zinc-500 bg-white bg-opacity-25 hover:bg-opacity-50 border-1'
            }
            isIconOnly
            radius="full"
            aria-label="Remove"
            onClick={() => setFile(null)}
          >
            <IconX size="1rem" className="border-zinc-500" />
          </Button>
          <Image
            src={URL.createObjectURL(file)}
            alt="preview"
            className={'h-full w-full object-cover rounded-xl'}
          />
        </div>
      ) : (
        <div
          className={
            'h-full flex flex-col justify-center items-center cursor-pointer'
          }
          onClick={() => fileRef.current?.click()}
        >
          <BiSolidCloudUpload size="3rem" />
          <p className="text-sm text-gray-500">Click here to upload an image</p>
        </div>
      )}
    </>
  );
}
