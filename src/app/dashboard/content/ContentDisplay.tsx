'use client';

import { content } from '@/db/schema';
import { thumbnail } from '@/lib/utils';
import { Image, Box, Text, Paper, Center, AspectRatio } from '@mantine/core';
import { IconPhoto, IconVideo, IconFileX } from '@tabler/icons-react';

type Props = {
  content: typeof content.$inferInsert;
};

export default function ContentDisplay({ content }: Props) {
  const { fileName, s3Key, type, fileSize } = content;

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

  if (type === 'image') {
    return (
      <Paper p='md' withBorder>
        <AspectRatio ratio={16 / 9} maw={800}>
          <Image
            src={thumbnail(s3Key || '')}
            alt={fileName || 'Content image'}
            radius='md'
            fit='contain'
            fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='
          />
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
            <source src={s3Key} />
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
