'use client';

import { content } from '@/db/schema';
import { getImageUrl } from '@/lib/utils';
import {
  AspectRatio,
  Badge,
  Box,
  Center,
  Flex,
  Image,
  Paper,
  Tabs,
  Text,
} from '@mantine/core';
import { IconDownload, IconEye, IconVideo } from '@tabler/icons-react';
import { useState } from 'react';
import { ContentTypeBadge } from './ContentTypeBadge';

type Props = {
  content: typeof content.$inferSelect;
};

export default function ContentDisplay({ content }: Props) {
  const { fileName, s3Key, thumbnailKey, watermarkedKey, type, fileSize } =
    content;
  const [activeTab, setActiveTab] = useState('preview');

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
    }
  };

  const urls = {
    original: getImageUrl(s3Key),
    thumbnail: getImageUrl(thumbnailKey),
    watermarked: getImageUrl(watermarkedKey),
  };

  if (type === 'image') {
    const getImageSrc = () => {
      switch (activeTab) {
        case 'thumbnail':
          return urls.thumbnail;
        case 'preview':
          return urls.watermarked;
        case 'original':
          return urls.original;
        default:
          return urls.watermarked || urls.thumbnail;
      }
    };

    return (
      <Paper p='md' withBorder>
        <Tabs value={activeTab} onChange={handleTabChange} pos={'relative'}>
          <Tabs.List>
            {urls.thumbnail && (
              <Tabs.Tab value='thumbnail' leftSection={<IconEye size={14} />}>
                Thumbnail
              </Tabs.Tab>
            )}
            {urls.watermarked && (
              <Tabs.Tab value='preview' leftSection={<IconEye size={14} />}>
                Preview
              </Tabs.Tab>
            )}
            <Tabs.Tab value='original' leftSection={<IconDownload size={14} />}>
              Original
            </Tabs.Tab>
            <ContentTypeBadge
              contentType={type}
              top={5}
              right={0}
              pos='absolute'
            />
          </Tabs.List>

          <Tabs.Panel value={activeTab} mt='md'>
            <AspectRatio ratio={16 / 9} maw={800}>
              <Image
                src={getImageSrc()}
                alt={fileName || 'Content image'}
                radius='md'
                fit='contain'
                fallbackSrc='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWRiNWJkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='
              />
            </AspectRatio>
          </Tabs.Panel>
        </Tabs>

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
    const getVideoSrc = () => {
      switch (activeTab) {
        case 'preview':
          return urls.watermarked;
        case 'original':
          return urls.original;
        default:
          return urls.watermarked || urls.original;
      }
    };

    return (
      <Paper p='md' withBorder>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            {urls.watermarked && (
              <Tabs.Tab value='preview' leftSection={<IconEye size={14} />}>
                Preview
              </Tabs.Tab>
            )}
            <Tabs.Tab value='original' leftSection={<IconDownload size={14} />}>
              Original
            </Tabs.Tab>
            <ContentTypeBadge contentType={type} top={5} right={0} />
          </Tabs.List>

          <Tabs.Panel value={activeTab} mt='md'>
            <AspectRatio ratio={16 / 9} maw={800}>
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
            </AspectRatio>
          </Tabs.Panel>
        </Tabs>

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
