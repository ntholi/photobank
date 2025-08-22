'use client';

import {
  Paper,
  Stack,
  Text,
  Group,
  Image,
  Box,
  Center,
  rem,
} from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { getImageUrl } from '@/lib/utils';

type ExistingContent = {
  id?: string;
  fileName?: string | null;
  fileSize?: number | null;
  type?: 'image' | 'video';
  thumbnailKey?: string;
  s3Key?: string;
  watermarkedKey?: string;
};

type ExistingContentDisplayProps = {
  content: ExistingContent;
};

export default function ExistingContentDisplay({
  content,
}: ExistingContentDisplayProps) {
  const isImage = content.type === 'image';
  const thumbnailUrl = content.thumbnailKey
    ? getImageUrl(content.thumbnailKey)
    : undefined;

  const fileName = content.fileName || 'Unknown file';
  const fileSize = content.fileSize || 0;

  return (
    <Paper p='md' withBorder>
      <Stack gap='xs'>
        <Group gap='xs'>
          <IconPhoto size={16} />
          <Text size='sm' fw={500}>
            {fileName}
          </Text>
          <Text size='xs' c='dimmed'>
            (Existing file)
          </Text>
        </Group>
        <Text size='xs' c='dimmed'>
          {(fileSize / 1024 / 1024).toFixed(2)} MB
        </Text>
        {isImage && thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={fileName}
            radius='md'
            maw={200}
            mah={200}
            fit='cover'
            fallbackSrc={`data:image/svg+xml,${encodeURIComponent(
              `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f1f3f4"/>
                <text x="100" y="110" text-anchor="middle" fill="#9ca3af" font-size="14">Image Preview</text>
              </svg>`
            )}`}
            onError={(e) => {
              console.warn('Failed to load thumbnail:', thumbnailUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : isImage && !thumbnailUrl ? (
          <Box bg='gray.1' p='md' style={{ borderRadius: rem(8) }}>
            <Center>
              <Text size='sm' c='dimmed'>
                Image: {fileName}
              </Text>
            </Center>
          </Box>
        ) : null}
        {!isImage && (
          <Box bg='gray.1' p='md' style={{ borderRadius: rem(8) }}>
            <Center>
              <Text size='sm' c='dimmed'>
                Video: {fileName}
              </Text>
            </Center>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
