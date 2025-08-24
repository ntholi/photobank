'use client';

import { Card, Image, Box, Stack, Text, Paper } from '@mantine/core';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { getImageUrl } from '@/lib/utils';

type Cover = {
  id: string;
  fileName?: string | null;
  thumbnailKey?: string | null;
  watermarkedKey?: string | null;
  s3Key?: string | null;
};

type Props = {
  cover: Cover | null;
  aboutHtml?: string | null;
};

export default function AboutSection({ cover, aboutHtml }: Props) {
  const { url } = usePresignedUrl(cover?.s3Key || '', Boolean(cover?.s3Key));

  const fallback = cover?.watermarkedKey
    ? getImageUrl(cover.watermarkedKey)
    : cover?.thumbnailKey
      ? getImageUrl(cover.thumbnailKey)
      : undefined;

  const src = url || fallback;

  return (
    <Stack gap='md'>
      {cover && src ? (
        <Card withBorder p='sm'>
          <Image
            src={src}
            alt={cover.fileName || 'Cover content'}
            radius='sm'
            height={300}
            fit='cover'
          />
        </Card>
      ) : null}
      <Paper withBorder p='sm'>
        {aboutHtml ? (
          <Box dangerouslySetInnerHTML={{ __html: aboutHtml }} />
        ) : (
          <Text size='sm' c='dimmed'>
            No information available.
          </Text>
        )}
      </Paper>
    </Stack>
  );
}
