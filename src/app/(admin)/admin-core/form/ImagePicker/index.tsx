'use client';
import { storage } from '@/lib/config/firebase';
import {
  ActionIcon,
  Box,
  Flex,
  Loader,
  Modal,
  Paper,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconPhoto } from '@tabler/icons-react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { ImagePickerProps } from '../../types';
import { variableToLabel } from '../../utils/utils';
import ImageCropper from './ImageCropper';
import ImageDisplay from './ImageDisplay';
import UploadButton from './UploadButton';

export default function ImagePicker(props: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [image, setImage] = useState<string | null | undefined>();
  const { colorScheme } = useMantineColorScheme();
  const [opened, { open: openDrawer, close }] = useDisclosure(false);

  useEffect(() => {
    setImage(props.value ? props.value : null);
  }, [props.value]);

  const handleDelete = () =>
    modals.openConfirmModal({
      centered: true,
      title: 'Delete',
      children: 'Are you sure you want to delete this image?',
      confirmProps: { color: 'red' },
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: async () => {
        setImage(null);
        props.onChange(null);
        const fileRef = ref(storage, props.value);
        await deleteObject(fileRef);
      },
    });

  async function handleUpload() {
    try {
      if (inputRef.current?.files?.length) {
        const file = inputRef.current.files[0];
        const path = await generateFilePath(props.folder, file);
        const fileRef = ref(storage, path);

        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          console.error,
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImage(downloadURL);
            props.onChange(downloadURL);
          },
        );
      }
    } finally {
      setUploadProgress(null);
    }
  }

  return (
    <Box>
      <Modal opened={opened} onClose={close} title='Crop Image' size={'lg'}>
        {image && (
          <ImageCropper
            imageUri={image}
            uploadComplete={(url) => {
              setImage(url);
              props.onChange(url);
              close();
            }}
          />
        )}
      </Modal>
      <input
        type='file'
        ref={inputRef}
        accept='image/*'
        onChange={handleUpload}
        hidden
      />
      <Text size='sm' fw={500}>
        {props.label || variableToLabel(props.name)}
      </Text>
      <Paper
        withBorder
        mt={5}
        h={props.height || 300}
        w='100%'
        bg={colorScheme == 'dark' ? 'dark.7' : 'gray.1'}
      >
        {image ? (
          <ImageDisplay
            disabled={props.disabled}
            image={image}
            handleDelete={handleDelete}
            showCropper={openDrawer}
          />
        ) : (
          <UploadButton
            progress={uploadProgress}
            inputRef={inputRef}
            disabled={props.disabled}
          />
        )}
      </Paper>
    </Box>
  );
}

// generate a unique file name based on file properties
async function generateFilePath(folder: string | undefined, file: File) {
  const message = file.name + file.size + file.lastModified;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const digest = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(digest));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const fileName = `${hash}.${file.name.split('.').pop()}`;
  if (folder) {
    return `${folder}/${fileName}`;
  }
  return fileName;
}
