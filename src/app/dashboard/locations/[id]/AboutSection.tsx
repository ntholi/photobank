'use client';

import { Card, Image, Box, Stack, Text, Paper, Group } from '@mantine/core';
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
  covers: Cover[] | null;
  aboutHtml?: string | null;
};

export default function AboutSection({ covers, aboutHtml }: Props) {
  const primary = covers && covers.length > 0 ? covers[0] : null;
  const { url } = usePresignedUrl(
    primary?.s3Key || '',
    Boolean(primary?.s3Key),
  );

  const fallback = primary?.watermarkedKey
    ? getImageUrl(primary.watermarkedKey)
    : primary?.thumbnailKey
      ? getImageUrl(primary.thumbnailKey)
      : undefined;

  const src = url || fallback;

  return (
    <Stack gap='md'>
      {primary && src ? (
        <Card withBorder p='sm'>
          <Image
            src={src}
            alt={primary.fileName || 'Cover content'}
            radius='sm'
            height={300}
            fit='cover'
          />
        </Card>
      ) : null}
      {covers && covers.length > 1 ? (
        <Group gap='sm'>
          {covers.slice(1).map((c) => (
            <Image
              key={c.id}
              src={getImageUrl(c.thumbnailKey || c.watermarkedKey || '')}
              alt={c.fileName || 'Cover content'}
              radius='sm'
              height={80}
              w={120}
              fit='cover'
            />
          ))}
        </Group>
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
