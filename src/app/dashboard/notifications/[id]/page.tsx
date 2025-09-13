import {
  DetailsView,
  DetailsViewBody,
  DetailsViewHeader,
  FieldView,
} from '@/components/adease';
import { notifications } from '@/db/schema';
import {
  deleteNotification,
  getNotification,
} from '@/server/notifications/actions';
import { Anchor, Group } from '@mantine/core';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotificationDetails({ params }: Props) {
  const { id } = await params;
  const notification = await getNotification(id);

  if (!notification) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        title={'Notification'}
        queryKey={['notifications']}
        handleDelete={async () => {
          'use server';
          await deleteNotification(id);
        }}
      />
      <DetailsViewBody gap={'xl'}>
        <FieldView label='Recipient'>
          <Anchor
            component={Link}
            href={`/dashboard/users/${notification.recipient.id}`}
          >
            {notification.recipient.name}
          </Anchor>
        </FieldView>
        <Group grow>
          <FieldView label='Type'>{notification.type}</FieldView>
          <FieldView label='Status'>{notification.status}</FieldView>
        </Group>
        <FieldView label='Title'>{notification.title}</FieldView>
        <FieldView label='Body'>{notification.body}</FieldView>
        {getContentId(notification) && (
          <FieldView label='Content'>
            <Anchor
              component={Link}
              href={`/dashboard/content/${getContentId(notification)}`}
            >
              View Content
            </Anchor>
          </FieldView>
        )}
      </DetailsViewBody>
    </DetailsView>
  );
}

function getContentId(item: typeof notifications.$inferSelect) {
  console.log('Payload:', item);
  if (
    item.type === 'content_updated' &&
    item.payload &&
    'contentId' in item.payload
  ) {
    return item.payload.contentId as string;
  }
  return null;
}
