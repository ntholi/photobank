'use client';
import { Button } from '@nextui-org/button';
import { GoUpload } from 'react-icons/go';
import { useDisclosure } from '@nextui-org/modal';
import UploadModal from './UploadModal';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ModalButton() {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/photos/upload-url')
      .then((res) => {
        console.log('res.data', res.data);
        const { url } = res.data;
        setUploadUrl(url);
      })
      .finally(() => setLoading(false));
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <UploadModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <Button
        onPress={onOpen}
        startContent={<GoUpload />}
        color="primary"
        className="mt-5"
        isLoading={loading}
        isDisabled={!uploadUrl}
      >
        Upload
      </Button>
    </>
  );
}
