'use client';
import React from 'react';
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
import { profilePath } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import axios, { AxiosProgressEvent } from 'axios';
import ImageInput from './ImageInput';

type Props = {
  uploadUrl: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UploadModal({
  uploadUrl,
  isOpen,
  onOpenChange,
}: Props) {
  const { user } = useSession().data || {};
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleFileUpload = async () => {
    if (file) {
      setUploading(true);
      const response = await axios.put(uploadUrl, file, {
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (e.total) {
            setUploadProgress((e.loaded / e.total) * 100);
          }
        },
      });
      setUploading(false);

      const { photo, url } = response.data;
      if (photo && url) {
        const encodedUrl = encodeURIComponent(url);
        router.push(
          `${profilePath(user)}/uploads/${photo.id}?photoUrl=${encodedUrl}`,
        );
      }
    }
  };

  return (
    <Modal
      size={isMobile ? 'full' : 'lg'}
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Upload Photo
            </ModalHeader>
            <ModalBody className={'md:px-10 md:py-5'}>
              <div className="h-72 border border-gray-300 rounded-xl overflow-clip">
                <ImageInput file={file} setFile={setFile} />
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-gray-300 flex justify-between">
              <Button
                className="border-1"
                color="danger"
                variant="bordered"
                onClick={onClose}
              >
                Close {uploadProgress}
              </Button>
              <Button
                color="primary"
                isDisabled={!file}
                onPress={async () => {
                  await handleFileUpload();
                  onClose();
                }}
                isLoading={uploading}
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
