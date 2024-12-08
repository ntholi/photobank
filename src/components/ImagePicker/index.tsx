'use client';
import { Box, Modal, Paper, Text, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import ImageDisplay from './ImageDisplay';
import UploadButton from './UploadButton';
import { thumbnail } from '@/lib/config/urls';
import { Location } from '@prisma/client';

export type ImagePickerProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: any;
  onChange?: any;
  checked?: any;
  error?: any;
  onFocus?: any;
  onBlur?: any;
  disabled?: boolean;
  hidden?: boolean;
  aspectRatio?: number;
  description?: string;
  folder?: string;
  height?: number;
  photoFileName?: string;
  location: Location;
};

export default function ImagePicker(props: ImagePickerProps) {
  const [image, setImage] = useState<string | null | undefined>();
  const colorScheme = useComputedColorScheme('dark');
  const [opened, { open: openDrawer, close }] = useDisclosure(false);

  useEffect(() => {
    if (props.photoFileName) {
      setImage(thumbnail(props.photoFileName));
    }
  }, [props.photoFileName]);

  const handleDelete = () => {
    return modals.openConfirmModal({
      centered: true,
      title: 'Delete',
      children: 'Are you sure you want to delete this image?',
      confirmProps: { color: 'red' },
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => {
        setImage(null);
        props.onChange(null);
      },
    });
  };

  return (
    <Box>
      <Modal
        opened={opened}
        onClose={close}
        title='Crop Image'
        size={'lg'}
      ></Modal>
      <Text size='sm' fw={500}>
        {props.label}
      </Text>
      <Paper
        withBorder
        h={props.height || 265}
        w='100%'
        bg={colorScheme == 'dark' ? 'dark.7' : 'gray.1'}
      >
        {image ? (
          <ImageDisplay
            disabled={props.disabled}
            image={image}
            handleDelete={handleDelete}
          />
        ) : (
          <UploadButton
            location={props.location}
            handleImageChange={(it) => {
              const imgUrl = thumbnail(it.fileName);
              setImage(imgUrl);
              props.onChange(it.id);
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
