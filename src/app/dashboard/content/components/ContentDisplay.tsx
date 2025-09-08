'use client';

import { content } from '@/db/schema';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { formatDateTime, getImageUrl } from '@/lib/utils';
import {
  AspectRatio,
  Box,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core';
import { IconVideo } from '@tabler/icons-react';
import { useState } from 'react';
import { ContentTypeBadge } from './ContentTypeBadge';

type Props = { content: typeof content.$inferSelect };

export default function ContentDisplay({ content }: Props) {
  const {
    fileName,
    s3Key,
    thumbnailKey,
    watermarkedKey,
    type,
    fileSize,
    createdAt,
  } = content;
  const [activeVersion, setActiveVersion] = useState('preview');

  const { url, isLoading: isLoadingPresigned } = usePresignedUrl(
    s3Key,
    activeVersion === 'original',
  );

  const urls = {
    original: url,
    thumbnail: getImageUrl(thumbnailKey),
    watermarked: getImageUrl(watermarkedKey),
  };

  if (type === 'image') {
    const getImageSrc = () => {
      switch (activeVersion) {
        case 'thumbnail':
          return urls.thumbnail;
        case 'preview':
          return urls.watermarked;
        case 'original':
          return urls.original || urls.watermarked || urls.thumbnail;
        default:
          return urls.watermarked || urls.thumbnail;
      }
    };

    const isOriginalLoading =
      activeVersion === 'original' && isLoadingPresigned;

    return (
      <Paper p='md' withBorder>
        <Flex justify='space-between' mb='sm' align='flex-start'>
          <SegmentedControl
            value={activeVersion}
            onChange={setActiveVersion}
            size='sm'
            data={[
              ...(urls.thumbnail
                ? [{ label: 'Thumb', value: 'thumbnail' }]
                : []),
              ...(urls.watermarked
                ? [{ label: 'Preview', value: 'preview' }]
                : []),
              { label: 'Original', value: 'original' },
            ]}
            styles={() => ({
              root: {
                backgroundColor: 'transparent',
                border: '1px solid var(--mantine-color-default-border)',
              },
              indicator: { transition: 'transform 150ms ease' },
            })}
          />
          <ContentTypeBadge contentType={type} />
        </Flex>
        <AspectRatio ratio={16 / 9} maw={800} mx='auto'>
          {isOriginalLoading ? (
            <Center h='100%'>
              <Box ta='center'>
                <Loader size='md' />
                <Text size='sm' c='dimmed' mt='xs'>
                  Loading original content...
                </Text>
              </Box>
            </Center>
          ) : (
            <Image
              src={getImageSrc()}
              alt={fileName || 'Content image'}
              radius='md'
              fit='contain'
              fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='
            />
          )}
        </AspectRatio>
        <Flex mt='md' justify='space-between'>
          <Box>
            <Text size='sm' fw={500}>
              {fileName}
            </Text>
            {fileSize && (
              <Text size='xs' c='dimmed'>
                {(fileSize / 1024 / 1024).toFixed(2)} MB
              </Text>
            )}
          </Box>
          <Stack gap={0} align='flex-end'>
            <Text size='sm' fw={500}>
              {formatDateTime(createdAt)}
            </Text>
            <Text size='xs' c='dimmed'>
              Uploaded
            </Text>
          </Stack>
        </Flex>
      </Paper>
    );
  }

  if (type === 'video') {
    const getVideoSrc = () => {
      switch (activeVersion) {
        case 'preview':
          return urls.watermarked;
        case 'original':
          return urls.original || urls.watermarked;
        default:
          return urls.watermarked || urls.original;
      }
    };

    const isOriginalLoading =
      activeVersion === 'original' && isLoadingPresigned;

    return (
      <Paper p='md' withBorder>
        <Group justify='space-between' mb='sm' align='flex-start'>
          <SegmentedControl
            value={activeVersion}
            onChange={setActiveVersion}
            size='xs'
            data={[
              ...(urls.watermarked
                ? [{ label: 'Preview', value: 'preview' }]
                : []),
              { label: 'Original', value: 'original' },
            ]}
            styles={() => ({
              root: {
                backgroundColor: 'transparent',
                border: '1px solid var(--mantine-color-default-border)',
              },
              indicator: { transition: 'transform 150ms ease' },
            })}
          />
          <ContentTypeBadge contentType={type} />
        </Group>
        <AspectRatio ratio={16 / 9} maw={800} mx='auto'>
          {isOriginalLoading ? (
            <Center h='100%'>
              <Box ta='center'>
                <Loader size='md' />
                <Text size='sm' c='dimmed' mt='xs'>
                  Loading original content...
                </Text>
              </Box>
            </Center>
          ) : (
            <video
              controls
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 'var(--mantine-radius-md)',
              }}
            >
              <source src={getVideoSrc()} />
              <Center h='100%'>
                <Box ta='center'>
                  <IconVideo size={48} color='var(--mantine-color-gray-5)' />
                  <Text size='sm' c='dimmed' mt='xs'>
                    Video cannot be played in this browser
                  </Text>
                </Box>
              </Center>
            </video>
          )}
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
