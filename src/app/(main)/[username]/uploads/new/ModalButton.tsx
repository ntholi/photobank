'use client';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';
import { useDisclosure } from '@nextui-org/modal';
import UploadModal from './UploadModal';

type Props = {
  uploadUrl: {
    uploadURL: string;
    id: string;
  };
};

export default function ModalButton({ uploadUrl }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <UploadModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        uploadUrl={uploadUrl}
      />
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
