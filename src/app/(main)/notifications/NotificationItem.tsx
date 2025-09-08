'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { IoMdCheckmarkCircle, IoMdTime, IoMdOpen } from 'react-icons/io';
import { notifications } from '@/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { useOptimisticMarkAsRead } from '@/hooks/useNotifications';

interface ContentUpdatedPayload {
  changeType: 'tags' | 'content_fields';
  addedTags?: string[];
  removedTags?: string[];
  changedFields?: string[];
}

interface ContentStatusChangePayload {
  newStatus: string;
}

interface SystemPayload {
  [key: string]: unknown;
}

type NotificationPayload =
  | ContentUpdatedPayload
  | ContentStatusChangePayload
  | SystemPayload;

type Notification = typeof notifications.$inferSelect & {
  recipient: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

interface NotificationItemProps {
  notification: Notification;
  onNavigate?: (notification: Notification) => void;
}

export default function NotificationItem({
  notification,
  onNavigate,
}: NotificationItemProps) {
  const markAsReadMutation = useOptimisticMarkAsRead();

  const isContentUpdatedPayload = (
    payload: unknown,
  ): payload is ContentUpdatedPayload => {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      ('changeType' in payload ||
        'changedFields' in payload ||
        'addedTags' in payload ||
        'removedTags' in payload)
    );
  };

  const isContentStatusChangePayload = (
    payload: unknown,
  ): payload is ContentStatusChangePayload => {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'newStatus' in payload &&
      typeof (payload as ContentStatusChangePayload).newStatus === 'string'
    );
  };

  const handleMarkAsRead = () => {
    if (notification.status === 'unread') {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const handleClick = () => {
    if (notification.status === 'unread') {
      markAsReadMutation.mutate(notification.id);
    }
    onNavigate?.(notification);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'content_status_change':
      case 'content_published':
        return '📸';
      case 'content_updated':
        return '✏️';
      case 'content_rejected':
        return '❌';
      case 'system':
      default:
        return '📋';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'content_published':
        return 'success';
      case 'content_rejected':
        return 'danger';
      case 'content_updated':
        return 'warning';
      case 'content_status_change':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatNotificationTime = (createdAt: Date) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  return (
    <Card
      className={`w-full cursor-pointer shadow-sm ${
        notification.status === 'unread'
          ? 'bg-primary/5 border-primary border-l-4 shadow-md'
          : 'hover:shadow-md'
      }`}
      isPressable
      onPress={handleClick}
    >
      <CardBody className='p-4'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            {notification.recipient?.image ? (
              <Avatar
                src={notification.recipient.image}
                alt={notification.recipient.name || 'User'}
                size='md'
              />
            ) : (
              <div className='bg-default-100 flex h-10 w-10 items-center justify-center rounded-full text-lg'>
                {getNotificationIcon(notification.type)}
              </div>
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='mb-2 flex items-start justify-between'>
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='text-foreground font-semibold'>
                  {notification.title || 'Notification'}
                </h3>
                <Chip
                  size='sm'
                  color={getNotificationColor(notification.type)}
                  variant='flat'
                >
                  {notification.type.replace(/_/g, ' ')}
                </Chip>
              </div>
              <div className='ml-2 flex items-center gap-2'>
                {notification.status === 'unread' && (
                  <div className='bg-primary h-2 w-2 rounded-full' />
                )}
                <Button
                  isIconOnly
                  size='sm'
                  variant='light'
                  onPress={handleMarkAsRead}
                  aria-label={
                    notification.status === 'unread'
                      ? 'Mark as read'
                      : 'Already read'
                  }
                >
                  <IoMdCheckmarkCircle />
                </Button>
              </div>
            </div>

            {notification.body && (
              <p className='text-default-600 mb-3 text-sm leading-relaxed'>
                {notification.body}
              </p>
            )}

            <div className='text-default-500 flex items-center justify-between text-xs'>
              <div className='flex items-center gap-1'>
                <IoMdTime />
                <span>{formatNotificationTime(notification.createdAt)}</span>
              </div>
            </div>

            {notification.payload && (
              <div className='bg-default-50 mt-2 rounded-lg p-2'>
                <p className='text-default-600 text-xs'>
                  {notification.type === 'content_updated' &&
                    isContentUpdatedPayload(notification.payload) && (
                      <>
                        {notification.payload.changeType === 'tags' && (
                          <>
                            {notification.payload.addedTags &&
                              notification.payload.addedTags.length > 0 && (
                                <div className='mb-1'>
                                  <span className='text-success font-medium'>
                                    Added tags:
                                  </span>{' '}
                                  {notification.payload.addedTags.join(', ')}
                                </div>
                              )}
                            {notification.payload.removedTags &&
                              notification.payload.removedTags.length > 0 && (
                                <div>
                                  <span className='text-danger font-medium'>
                                    Removed tags:
                                  </span>{' '}
                                  {notification.payload.removedTags.join(', ')}
                                </div>
                              )}
                          </>
                        )}
                        {notification.payload.changeType ===
                          'content_fields' && (
                          <>
                            <span className='font-medium'>Fields updated:</span>{' '}
                            {notification.payload.changedFields
                              ?.map((field: string) => {
                                switch (field) {
                                  case 'description':
                                    return 'Description';
                                  case 'locationId':
                                    return 'Location';
                                  case 'status':
                                    return 'Status';
                                  default:
                                    return field;
                                }
                              })
                              .join(', ')}
                          </>
                        )}
                        {!notification.payload.changeType &&
                          notification.payload.changedFields && (
                            <>
                              Fields updated:{' '}
                              {notification.payload.changedFields.join(', ')}
                            </>
                          )}
                      </>
                    )}
                  {notification.type === 'content_status_change' &&
                    isContentStatusChangePayload(notification.payload) && (
                      <>Status changed to: {notification.payload.newStatus}</>
                    )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
