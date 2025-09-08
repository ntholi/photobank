'use client';

import React from 'react';
import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@heroui/dropdown';
import { Badge } from '@heroui/badge';
import { Spinner } from '@heroui/spinner';
import { Avatar } from '@heroui/avatar';
import { Divider } from '@heroui/divider';
import { Link } from '@heroui/link';
import { IoMdNotifications, IoMdCheckmarkCircle } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import {
  useUnreadNotificationsCount,
  useRecentNotifications,
  useOptimisticMarkAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import { notifications } from '@/db/schema';
import { formatDistanceToNow } from 'date-fns';

type Notification = typeof notifications.$inferSelect & {
  recipient: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function NotificationsButton() {
  const router = useRouter();
  const { data: unreadCount = 0, isLoading: isLoadingCount } =
    useUnreadNotificationsCount();
  const { data: recentNotifications = [], isLoading: isLoadingRecent } =
    useRecentNotifications();
  const markAsReadMutation = useOptimisticMarkAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'unread') {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate based on notification type and payload
    if (notification.type === 'content_updated' && notification.payload) {
      const contentId = (notification.payload as any).contentId;
      if (contentId) {
        router.push(`/content/${contentId}`);
        return;
      }
    }

    // Default to notifications page
    router.push('/notifications');
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
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

  const formatNotificationTime = (createdAt: Date) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <Dropdown placement='bottom-end' className='min-w-80'>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='light'
          radius='full'
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Badge
            content={unreadCount > 99 ? '99+' : unreadCount}
            color={unreadCount > 0 ? 'danger' : 'default'}
            showOutline={false}
            size='sm'
            isInvisible={unreadCount === 0}
          >
            <IoMdNotifications className='text-foreground text-lg' />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Notifications' className='p-0'>
        <DropdownSection
          title='Notifications'
          className='mb-0'
          showDivider
          classNames={{
            heading: 'flex justify-between items-center px-3 py-2',
          }}
        >
          <DropdownItem
            key='header'
            className='cursor-default hover:bg-transparent'
            textValue='Notifications header'
          >
            <div className='flex w-full items-center justify-between'>
              <span className='text-foreground font-semibold'>
                Notifications
              </span>
              {unreadCount > 0 && (
                <Button
                  size='sm'
                  variant='ghost'
                  color='primary'
                  onPress={handleMarkAllAsRead}
                  isLoading={markAllAsReadMutation.isPending}
                  startContent={
                    !markAllAsReadMutation.isPending && (
                      <IoMdCheckmarkCircle className='text-sm' />
                    )
                  }
                >
                  Mark all read
                </Button>
              )}
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection className='p-0'>
          {isLoadingRecent || isLoadingCount ? (
            <DropdownItem
              key='loading'
              className='cursor-default hover:bg-transparent'
              textValue='Loading'
            >
              <div className='flex items-center justify-center py-4'>
                <Spinner size='sm' />
              </div>
            </DropdownItem>
          ) : recentNotifications.length === 0 ? (
            <DropdownItem
              key='empty'
              className='cursor-default hover:bg-transparent'
              textValue='No notifications'
            >
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <IoMdNotifications className='text-default-300 mb-2 text-4xl' />
                <p className='text-default-500 text-sm'>No notifications yet</p>
                <p className='text-default-400 text-xs'>
                  You&apos;ll see updates here
                </p>
              </div>
            </DropdownItem>
          ) : (
            recentNotifications.map((notification) => (
              <DropdownItem
                key={notification.id}
                className={`p-3 ${
                  notification.status === 'unread'
                    ? 'bg-primary/5 border-primary border-l-2'
                    : ''
                }`}
                textValue={notification.title || 'Notification'}
                onPress={() => handleNotificationClick(notification)}
              >
                <div className='flex w-full items-start gap-3'>
                  <div className='flex-shrink-0'>
                    {notification.recipient?.image ? (
                      <Avatar
                        src={notification.recipient.image}
                        alt={notification.recipient.name || 'User'}
                        size='sm'
                      />
                    ) : (
                      <div className='bg-default-100 flex h-8 w-8 items-center justify-center rounded-full text-lg'>
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1 flex items-start justify-between'>
                      <h4 className='text-foreground truncate text-sm font-medium'>
                        {notification.title}
                      </h4>
                      {notification.status === 'unread' && (
                        <div className='bg-primary ml-2 h-2 w-2 flex-shrink-0 rounded-full' />
                      )}
                    </div>
                    {notification.body && (
                      <p className='text-default-600 mb-1 line-clamp-2 text-xs'>
                        {truncateText(notification.body)}
                      </p>
                    )}
                    <p className='text-default-400 text-xs'>
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </DropdownItem>
            ))
          )}
        </DropdownSection>

        {recentNotifications.length > 0 ? (
          <DropdownSection className='pb-2'>
            <DropdownItem key='divider' className='cursor-default p-0'>
              <Divider />
            </DropdownItem>
            <DropdownItem
              key='view-all'
              className='text-center'
              textValue='View all notifications'
            >
              <Link
                href='/notifications'
                className='text-primary hover:text-primary-600 block w-full text-sm font-medium'
              >
                View all notifications
              </Link>
            </DropdownItem>
          </DropdownSection>
        ) : null}
      </DropdownMenu>
    </Dropdown>
  );
}
