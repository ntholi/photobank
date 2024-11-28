'use client';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { storeFile } from '@/lib/utils/indexedDB';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import ImageInput from './ImageInput';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UploadModal({ isOpen, onOpenChange }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const isMobile = useIsMobile();
  const router = useRouter();

  const handleSubmit = async () => {
    if (file) {
      try {
        await storeFile('uploadFile', file);
        if (file.type.startsWith('image/')) {
          router.push('/upload/photo');
        } else if (file.type.startsWith('video/')) {
          router.push('/upload/video');
        }
      } catch (error) {
        console.error('Error storing file:', error);
        alert('There was an error storing the file. Please try again.');
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
      backdrop='blur'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      closeButton={null}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Upload Photo
            </ModalHeader>
            <ModalBody className={'md:px-10 md:py-5'}>
              <div className='h-72 overflow-clip rounded-xl border border-gray-300'>
                {imageInput}
              </div>
            </ModalBody>
            <ModalFooter className='flex justify-between border-t border-gray-300'>
              <Button
                className='border-1'
                color='danger'
                variant='bordered'
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                color='primary'
                isDisabled={!file}
                onPress={async () => {
                  await handleSubmit();
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
