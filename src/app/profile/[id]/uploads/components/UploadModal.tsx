'use client';
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Image } from '@nextui-org/image';
import { GrClose } from 'react-icons/gr';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useSession } from '@/lib/context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
export default function UploadModal({ isOpen, onOpenChange }: Props) {
  const { user } = useSession();
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
    if (user && file) {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const storage = getStorage();
      const storageRef = ref(storage, `${user.uid}/${uuidv4()}.${ext}`);

      await uploadBytes(storageRef, file);
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
                onPress={async () => {
                  await handleFileUpload();
                  onClose();
                }}
                isLoading={uploading}
              >
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
