'use client';

import {
  CopyButton,
  Flex,
  Tooltip,
  ActionIcon,
  Anchor,
  Text,
  Group,
  Divider,
  Box,
} from '@mantine/core';
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconId,
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

type Props = {
  contentId: string;
};

export default function ContentID({ contentId }: Props) {
  return (
    <Box>
      <Flex justify='space-between'>
        <Group gap={4}>
          <Text size='sm' fw={500} c='dimmed'>
            ID:
          </Text>
          <Text size='sm' mr='sm'>
            {contentId}
          </Text>
          <CopyButton value={contentId} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position='right'
              >
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  variant='subtle'
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
        <Anchor
          component={Link}
          href={`/content/${contentId}`}
          target='_blank'
          variant='subtle'
        >
          <IconExternalLink size={16} />
        </Anchor>
      </Flex>
      <Divider mt='xs' />
    </Box>
  );
}
