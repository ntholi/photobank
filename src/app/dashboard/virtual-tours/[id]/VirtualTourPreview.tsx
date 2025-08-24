'use client';

import {
  Card,
  AspectRatio,
  Anchor,
  Group,
  Text,
  Button,
  Stack,
  Center,
  ActionIcon,
  Tooltip,
  Loader,
} from '@mantine/core';
import { IconExternalLink, IconRefresh } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

type Props = {
  url: string;
};

function isEmbeddable(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function VirtualTourPreview({ url }: Props) {
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  if (!url) {
    return (
      <Card withBorder radius='md' padding='md'>
        <Text size='sm' c='dimmed'>
          No preview available
        </Text>
      </Card>
    );
  }

  const embeddable = isEmbeddable(url);
  const iframeSrc = useMemo(() => url, [url, reloadKey]);

  return (
    <Card withBorder radius='md' padding='md'>
      <Stack gap='sm'>
        <Group justify='flex-end' align='center'>
          <Group gap='xs'>
            <Tooltip label='Open in new tab'>
              <Anchor href={url} target='_blank' rel='noreferrer'>
                <ActionIcon variant='subtle' aria-label='Open virtual tour'>
                  <IconExternalLink size={16} />
                </ActionIcon>
              </Anchor>
            </Tooltip>
            <Tooltip label='Reload preview'>
              <ActionIcon
                variant='subtle'
                aria-label='Reload preview'
                onClick={() => {
                  setFailed(false);
                  setLoading(true);
                  setReloadKey((k) => k + 1);
                }}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {embeddable && !failed ? (
          <AspectRatio ratio={16 / 9}>
            <>
              {loading && (
                <Center>
                  <Loader size='sm' />
                </Center>
              )}
              <iframe
                key={reloadKey}
                src={iframeSrc}
                title='Virtual tour preview'
                style={{ border: 0, width: '100%', height: '100%' }}
                loading='lazy'
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setFailed(true);
                }}
                sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
              />
            </>
          </AspectRatio>
        ) : (
          <Center style={{ minHeight: 200 }}>
            <Stack gap={4} align='center'>
              <Text size='sm' c='dimmed'>
                {failed ? 'Failed to load preview' : 'Preview not available'}
              </Text>
              <Anchor href={url} target='_blank' rel='noreferrer'>
                <Button
                  size='xs'
                  variant='light'
                  rightSection={<IconExternalLink size={14} />}
                >
                  Open virtual tour
                </Button>
              </Anchor>
            </Stack>
          </Center>
        )}

        <Text size='xs' c='dimmed' truncate>
          {url}
        </Text>
      </Stack>
    </Card>
  );
}
