'use client';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';
import { useDisclosure } from '@nextui-org/modal';
import UploadModal from './UploadModal';

export default function ModalButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {<UploadModal isOpen={isOpen} onOpenChange={onOpenChange} />}

      <Button
        onPress={onOpen}
        startContent={<GoUpload />}
        color="primary"
        className="mt-5"
      >
        Upload
      </Button>
    </>
  );
}
