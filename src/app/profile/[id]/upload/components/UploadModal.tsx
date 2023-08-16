import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';
import { BiSolidCloudUpload } from 'react-icons/bi';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
export default function UploadModal({ isOpen, onOpenChange }: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  return (
    <Modal
      size={isMobile ? 'full' : '2xl'}
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
              <input type="file" name="picture" ref={fileRef} hidden />
              <div
                className={
                  'w-full h-72 border border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer'
                }
                onClick={() => fileRef.current?.click()}
              >
                <BiSolidCloudUpload size="3rem" />
                <p className="text-sm text-gray-500">
                  Click here to upload an image
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
