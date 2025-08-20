'use client';

import { content } from '@/db/schema';
import { getThumbnailUrl, getWatermarkedUrl } from '@/lib/aws';
import {
  Image,
  Box,
  Text,
  Paper,
  Center,
  AspectRatio,
  Group,
  Button,
} from '@mantine/core';
import {
  IconPhoto,
  IconVideo,
  IconFileX,
  IconEye,
  IconDownload,
} from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
  content: typeof content.$inferInsert;
};

export default function ContentDisplay({ content }: Props) {
  const { fileName, s3Key, thumbnailKey, watermarkedKey, type, fileSize } =
    content;
  const [showWatermarked, setShowWatermarked] = useState(false);

  if (!s3Key) {
    return (
      <Paper p='xl' withBorder>
        <Center>
          <Box ta='center'>
            <IconFileX size={48} color='var(--mantine-color-gray-5)' />
            <Text size='sm' c='dimmed' mt='xs'>
              No content file available
            </Text>
          </Box>
        </Center>
      </Paper>
    );
  }

  console.log(
    'getWatermarkedUrl(watermarkedKey)',
    watermarkedKey ? getWatermarkedUrl(watermarkedKey) : 'No watermarked key'
  );
  console.log(
    'getThumbnailUrl(thumbnailKey)',
    thumbnailKey ? getThumbnailUrl(thumbnailKey) : 'No thumbnail key'
  );

  if (type === 'image') {
    return (
      <Paper p='md' withBorder>
        <AspectRatio ratio={16 / 9} maw={800}>
          <Image
            src={thumbnailKey ? getThumbnailUrl(thumbnailKey) : undefined}
            alt={fileName || 'Content image'}
            radius='md'
            fit='contain'
            fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='
          />
        </AspectRatio>

        {(thumbnailKey || watermarkedKey) && (
          <Group mt='sm' gap='xs'>
            <Button
              size='xs'
              variant={!showWatermarked ? 'filled' : 'light'}
              leftSection={<IconEye size={14} />}
              onClick={() => setShowWatermarked(false)}
            >
              Thumbnail
            </Button>
            {watermarkedKey && (
              <Button
                size='xs'
                variant={showWatermarked ? 'filled' : 'light'}
                leftSection={<IconEye size={14} />}
                onClick={() => setShowWatermarked(true)}
              >
                Preview
              </Button>
            )}
            <Button
              size='xs'
              variant='light'
              leftSection={<IconDownload size={14} />}
              component='a'
              href={
                watermarkedKey ? getWatermarkedUrl(watermarkedKey) : undefined
              }
              target='_blank'
            >
              Original
            </Button>
          </Group>
        )}

        {fileName && (
          <Box mt='sm'>
            <Text size='sm' fw={500}>
              {fileName}
            </Text>
            {fileSize && (
              <Text size='xs' c='dimmed'>
                {(fileSize / 1024 / 1024).toFixed(2)} MB
              </Text>
            )}
            {thumbnailKey && (
              <Text size='xs' c='dimmed'>
                Thumbnail: {thumbnailKey}
              </Text>
            )}
            {watermarkedKey && (
              <Text size='xs' c='dimmed'>
                Watermarked: {watermarkedKey}
              </Text>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  if (type === 'video') {
    return (
      <Paper p='md' withBorder>
        <AspectRatio ratio={16 / 9} maw={800}>
          <video
            controls
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <source
              src={
                watermarkedKey ? getWatermarkedUrl(watermarkedKey) : undefined
              }
            />
            <Center h='100%'>
              <Box ta='center'>
                <IconVideo size={48} color='var(--mantine-color-gray-5)' />
                <Text size='sm' c='dimmed' mt='xs'>
                  Video cannot be played in this browser
                </Text>
              </Box>
            </Center>
          </video>
        </AspectRatio>
        {fileName && (
          <Box mt='sm'>
            <Text size='sm' fw={500}>
              {fileName}
            </Text>
            {fileSize && (
              <Text size='xs' c='dimmed'>
                {(fileSize / 1024 / 1024).toFixed(2)} MB
              </Text>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  return null;
}
