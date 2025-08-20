'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getContentList } from '@/server/content/actions';
import { getThumbnailUrl } from '@/lib/aws';
import { Avatar, Group, Text, Badge } from '@mantine/core';
import { IconPhoto, IconVideo } from '@tabler/icons-react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/dashboard/content'}
      queryKey={['content']}
      getData={getContentList}
      actionIcons={[<NewLink key={'new-link'} href='/dashboard/content/new' />]}
      renderItem={(content) => (
        <ListItem
          id={content.id}
          label={
            <Group gap='sm' wrap='nowrap'>
              <Avatar
                size='sm'
                radius='md'
                // src={
                //   content.thumbnailKey
                //     ? getThumbnailUrl(content.thumbnailKey)
                //     : null
                // }
              >
                {content.type === 'image' ? (
                  <IconPhoto size={16} />
                ) : (
                  <IconVideo size={16} />
                )}
              </Avatar>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Text size='sm' fw={500} truncate>
                  {content.fileName || `${content.type}_${content.id}`}
                </Text>
                <Group gap='xs'>
                  <Badge size='xs' variant='light'>
                    {content.type}
                  </Badge>
                  <Badge size='xs' variant='outline'>
                    {content.status}
                  </Badge>
                  {content.fileSize && (
                    <Text size='xs' c='dimmed'>
                      {(content.fileSize / 1024 / 1024).toFixed(1)}MB
                    </Text>
                  )}
                </Group>
              </div>
            </Group>
          }
        />
      )}
    >
      {children}
    </ListLayout>
  );
}
