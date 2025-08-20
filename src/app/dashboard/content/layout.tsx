'use client';

import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getImageUrl } from '@/lib/utils';
import { getContentList } from '@/server/content/actions';
import { Avatar, Badge, Group, Text } from '@mantine/core';
import { IconPhoto, IconVideo } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';

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
                <Text fw={300} truncate>
                  {content.fileName || `${content.type}_${content.id}`}
                </Text>
                <Group gap='xs'>
                  <Badge size='xs' variant='light'>
                    {content.type}
                  </Badge>
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
