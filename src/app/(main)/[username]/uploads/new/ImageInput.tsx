'use client';
import React from 'react';
import { Button } from '@nextui-org/button';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { Image } from '@nextui-org/image';
import { GrClose } from 'react-icons/gr';

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};
export default function ImageInput({ file, setFile }: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
    else setFile(null);
  };

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
              'absolute top-1.5 right-1.5 z-50 bg-opacity-25 hover:bg-opacity-50 border-1 border-gray-400'
            }
            isIconOnly
            radius="full"
            aria-label="Remove"
            onClick={() => setFile(null)}
          >
            <GrClose color="white" />
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
