'use client';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios, { AxiosProgressEvent } from 'axios';
import ImageInput from './ImageInput';
import { Progress } from '@nextui-org/progress';
import { profilePath } from '@/lib/constants';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UploadModal({ isOpen, onOpenChange }: Props) {
  const { user } = useSession().data || {};
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>();
  const [message, setMessage] = useState<'' | 'Uploading' | 'Processing Image'>(
    '',
  );
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleFileUpload = async () => {
    if (file) {
      setProgress(0);
      setMessage('Uploading');
      const ext = file.name.split('.').pop();
      try {
        const { url, fileName } = (
          await axios.get(`/api/photos/upload-url?ext=${ext}`)
        ).data;

        await axios.put(url, file, {
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              setProgress((e.loaded / e.total) * 100);
            }
          },
        });
        if (fileName) {
          setMessage('Processing Image');
          setProgress(0);
          const { data } = await axios.post('/api/photos', {
            fileName,
          });

          router.push(`${profilePath(user)}/uploads/${data.photo.id}`);
        }
      } finally {
        setFile(null);
        setMessage('');
        setProgress(undefined);
      }
    }
  };

  const imageInput = useMemo(
    () => <ImageInput file={file} setFile={setFile} />,
    [file],
  );

  return (
    <Modal
      size={isMobile ? 'full' : 'lg'}
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      closeButton={<></>}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Upload Photo
            </ModalHeader>
            <ModalBody className={'md:px-10 md:py-5'}>
              <div className="h-72 border border-gray-300 rounded-xl overflow-clip">
                {imageInput}
              </div>
              {progress != undefined && (
                <Progress
                  size="sm"
                  label={message}
                  color={message === 'Processing Image' ? 'success' : 'primary'}
                  isIndeterminate={progress === 0}
                  value={progress}
                />
              )}
            </ModalBody>
            <ModalFooter className="border-t border-gray-300 flex justify-between">
              <Button
                className="border-1"
                color="danger"
                variant="bordered"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                color="primary"
                isDisabled={!file}
                isLoading={progress != undefined}
                onPress={async () => {
                  await handleFileUpload();
                  onClose();
                }}
              >
                Next
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
