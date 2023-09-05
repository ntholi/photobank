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
import { BiSolidCloudUpload } from 'react-icons/bi';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { Image } from '@nextui-org/image';
import { GrClose } from 'react-icons/gr';
import { useRouter } from 'next/navigation';
import { profilePath } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import api from '@/lib/config/api';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  uploadUrl?: null | {
    uploadURL: string;
    id: string;
  };
};
export default function UploadModal({
  isOpen,
  onOpenChange,
  uploadUrl,
}: Props) {
  const { user } = useSession().data || {};
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (file && uploadUrl) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/photos/uploads', {
        method: 'POST',
        body: formData,
      });

      console.log('response', response);

      setUploading(false);
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
              <input
                type="file"
                name="picture"
                ref={fileRef}
                onChange={handleFileChange}
                hidden
              />
              <div
                className={
                  'h-72 border border-gray-300 rounded-xl overflow-clip'
                }
              >
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
                    <p className="text-sm text-gray-500">
                      Click here to upload an image
                    </p>
                  </div>
                )}
              </div>
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
                onPress={async () => {
                  await handleFileUpload();
                  onClose();
                  // router.push(`${profilePath(user)}/uploads/${uploadUrl?.id}`);
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
