'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { createNotification } from '@/server/notifications/actions';
import { useSession } from 'next-auth/react';
import { notifications } from '@/db/schema';

type NotificationType = typeof notifications.$inferInsert;

export default function NotificationTester() {
  const { data: session } = useSession();

  const createTestNotification = async (type: string) => {
    if (!session?.user?.id) return;

    const notification: NotificationType = {
      recipientUserId: session.user.id,
      type: type as any,
      title: `Test ${type.replace(/_/g, ' ')} notification`,
      body: `This is a test notification of type ${type}. Created at ${new Date().toLocaleString()}`,
      status: 'unread',
      payload: {
        contentId: 'test-content-id',
        changedFields: ['description', 'status'],
      },
    };

    try {
      await createNotification(notification);
      console.log('Notification created successfully');
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <h3 className='text-lg font-semibold'>Notification Tester</h3>
      </CardHeader>
      <CardBody className='space-y-2'>
        <Button
          size='sm'
          color='primary'
          variant='flat'
          onPress={() => createTestNotification('content_published')}
        >
          Create Content Published
        </Button>
        <Button
          size='sm'
          color='warning'
          variant='flat'
          onPress={() => createTestNotification('content_updated')}
        >
          Create Content Updated
        </Button>
        <Button
          size='sm'
          color='danger'
          variant='flat'
          onPress={() => createTestNotification('content_rejected')}
        >
          Create Content Rejected
        </Button>
        <Button
          size='sm'
          color='secondary'
          variant='flat'
          onPress={() => createTestNotification('system')}
        >
          Create System Notification
        </Button>
      </CardBody>
    </Card>
  );
}
