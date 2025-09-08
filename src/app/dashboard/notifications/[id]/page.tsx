import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import {
  getNotification,
  deleteNotification,
} from '@/server/notifications/actions';

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
      <DetailsViewBody>
        <FieldView label='Recipient'>{notification.recipient.name}</FieldView>
        <FieldView label='Type'>{notification.type}</FieldView>
        <FieldView label='Status'>{notification.status}</FieldView>
        <FieldView label='Title'>{notification.title}</FieldView>
        <FieldView label='Body'>{notification.body}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}
