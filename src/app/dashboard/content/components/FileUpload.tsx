'use client';

import {
  FileInput,
  Image,
  Stack,
  Text,
  Group,
  ActionIcon,
  Box,
  Center,
  rem,
  Paper,
  Loader,
} from '@mantine/core';
import { Dropzone, MIME_TYPES, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { notifications } from '@mantine/notifications';

type FileUploadProps = {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string[];
  maxSize?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onCancel?: () => void;
  showCancel?: boolean;
};

const defaultAcceptedTypes = [
  MIME_TYPES.jpeg,
  MIME_TYPES.png,
  MIME_TYPES.webp,
  MIME_TYPES.mp4,
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
];

export default function FileUpload({
  value,
  onChange,
  accept = defaultAcceptedTypes,
  maxSize = 100 * 1024 * 1024, // 100MB
  label = 'Upload File',
  placeholder = 'Click or drag file here to upload',
  disabled = false,
  required = false,
  onCancel,
  showCancel = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const openRef = useRef<() => void>(null);

  const handleDrop = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!accept.includes(file.type)) {
      notifications.show({
        title: 'Invalid file type',
        message: 'Please select a valid image or video file',
        color: 'red',
      });
      return;
    }

    if (file.size > maxSize) {
      notifications.show({
        title: 'File too large',
        message: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
        color: 'red',
      });
      return;
    }

    onChange(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const isImage = (file: File) => file.type.startsWith('image/');
  const isVideo = (file: File) => file.type.startsWith('video/');

  return (
    <Stack gap='sm'>
      <Text size='sm' fw={500}>
        {label}
        {required && (
          <span style={{ color: 'var(--mantine-color-red-6)' }}>*</span>
        )}
      </Text>

      {value ? (
        <Paper p='md' withBorder>
          <Group justify='space-between' align='flex-start'>
            <Stack gap='xs' style={{ flex: 1 }}>
              <Group gap='xs'>
                <IconPhoto size={16} />
                <Text size='sm' fw={500}>
                  {value.name}
                </Text>
              </Group>
              <Text size='xs' c='dimmed'>
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </Text>
              {preview && isImage(value) && (
                <Image
                  src={preview}
                  alt='Preview'
                  radius='md'
                  maw={200}
                  mah={200}
                  fit='cover'
                />
              )}
              {isVideo(value) && (
                <Box bg='gray.1' p='md' style={{ borderRadius: rem(8) }}>
                  <Center>
                    <Text size='sm' c='dimmed'>
                      Video: {value.name}
                    </Text>
                  </Center>
                </Box>
              )}
            </Stack>
            <Group gap='xs'>
              {showCancel && onCancel && (
                <ActionIcon
                  variant='subtle'
                  color='gray'
                  onClick={onCancel}
                  disabled={disabled || uploading}
                  title='Cancel'
                >
                  <IconX size={16} />
                </ActionIcon>
              )}
              <ActionIcon
                variant='subtle'
                color='red'
                onClick={handleRemove}
                disabled={disabled || uploading}
                title={showCancel ? 'Remove' : 'Remove'}
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      ) : (
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          accept={accept}
          maxSize={maxSize}
          disabled={disabled || uploading}
          styles={{
            root: {
              backgroundColor: disabled
                ? 'var(--mantine-color-gray-1)'
                : undefined,
              cursor: 'pointer',
              border: '1px dashed var(--mantine-color-gray-7)',
            },
          }}
        >
          <Group
            justify='center'
            gap='lg'
            mih={220}
            style={{ pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)',
                }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)',
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              {uploading ? (
                <Loader size='lg' />
              ) : (
                <IconPhoto
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-dimmed)',
                  }}
                  stroke={1.5}
                />
              )}
            </Dropzone.Idle>

            <div>
              <Text size='xl' inline>
                {uploading ? 'Uploading...' : placeholder}
              </Text>
              <Text size='sm' c='dimmed' inline mt={7}>
                Attach files by dragging & dropping, selecting or pasting them
              </Text>
              <Text size='xs' c='dimmed' mt={5}>
                Supported: Images (JPEG, PNG, WebP) and Videos (MP4, MOV, AVI)
              </Text>
              <Text size='xs' c='dimmed'>
                Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}

      {!value && (
        <FileInput
          placeholder='Or click to browse files'
          accept={accept.join(',')}
          onChange={(file) => file && handleFileSelect(file)}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
      )}
    </Stack>
  );
}
