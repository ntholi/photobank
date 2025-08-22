'use client';

import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getImageUrl } from '@/lib/utils';
import { getContentList } from '@/server/content/actions';
import { Avatar, Badge, Group, Text } from '@mantine/core';
import { IconPhoto, IconVideo } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';
import { ContentTypeBadge } from './components/ContentTypeBadge';

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
              <Avatar radius={'xs'} src={getImageUrl(content.thumbnailKey)}>
                {content.type === 'image' ? (
                  <IconPhoto size={16} />
                ) : (
                  <IconVideo size={16} />
                )}
              </Avatar>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Text truncate size='sm'>
                  {content.fileName || `${content.type}_${content.id}`}
                </Text>
                <Group gap='xs'>
                  <ContentTypeBadge contentType={content.type} size='xs' />
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
