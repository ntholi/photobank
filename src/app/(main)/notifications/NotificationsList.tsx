'use client';

import React from 'react';
import { Spinner } from '@heroui/spinner';
import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import { Card, CardBody } from '@heroui/card';
import { IoMdNotifications, IoMdRefresh } from 'react-icons/io';
import NotificationItem from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { notifications } from '@/db/schema';
import { useRouter } from 'next/navigation';

type Notification = typeof notifications.$inferSelect & {
  recipient: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

interface NotificationsListProps {
  page: number;
  onPageChange: (page: number) => void;
  search: string;
  status: 'all' | 'unread' | 'read' | 'archived';
  type: string;
}

export default function NotificationsList({
  page,
  onPageChange,
  search,
  status,
  type,
}: NotificationsListProps) {
  const router = useRouter();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useNotifications(page, 12, {
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      type: type || undefined,
    });

  const handleNotificationNavigate = (notification: Notification) => {
    if (notification.type === 'content_updated' && notification.payload) {
      const contentId = (notification.payload as any).contentId;
      if (contentId) {
        router.push(`/content/${contentId}`);
        return;
      }
    }

    if (notification.type === 'content_published' && notification.payload) {
      const contentId = (notification.payload as any).contentId;
      if (contentId) {
        router.push(`/content/${contentId}`);
        return;
      }
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='space-y-4 text-center'>
          <Spinner size='lg' />
          <p className='text-default-600'>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className='w-full'>
        <CardBody className='py-8 text-center'>
          <div className='space-y-4'>
            <div className='text-danger text-4xl'>⚠️</div>
            <h3 className='text-foreground text-lg font-semibold'>
              Failed to load notifications
            </h3>
            <p className='text-default-600'>
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Button
              color='primary'
              variant='flat'
              onPress={() => refetch()}
              isLoading={isRefetching}
              startContent={!isRefetching && <IoMdRefresh />}
            >
              Try again
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Card className='w-full'>
        <CardBody className='py-12 text-center'>
          <div className='space-y-4'>
            <IoMdNotifications className='text-default-300 mx-auto text-6xl' />
            <h3 className='text-foreground text-lg font-semibold'>
              No notifications found
            </h3>
            <p className='text-default-600 mx-auto max-w-md'>
              {search || status !== 'all' || type
                ? 'No notifications match your current filters. Try adjusting your search criteria.'
                : "You don't have any notifications yet. You'll see updates about your content and system activities here."}
            </p>
            {(search || status !== 'all' || type) && (
              <Button
                color='primary'
                variant='flat'
                onPress={() => refetch()}
                isLoading={isRefetching}
                startContent={!isRefetching && <IoMdRefresh />}
              >
                Refresh
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <p className='text-default-600 text-sm'>
          Showing {data.data.length} of {data.pagination.total} notifications
          {search && ` for "${search}"`}
        </p>
        <Button
          isIconOnly
          variant='light'
          size='sm'
          onPress={() => refetch()}
          isLoading={isRefetching}
          aria-label='Refresh notifications'
        >
          <IoMdRefresh />
        </Button>
      </div>

      <div className='space-y-4'>
        {data.data.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onNavigate={handleNotificationNavigate}
          />
        ))}
      </div>

      {data.pagination.totalPages > 1 && (
        <div className='flex justify-center pt-4'>
          <Pagination
            total={data.pagination.totalPages}
            page={page}
            onChange={onPageChange}
            showControls
            showShadow
            color='primary'
            size='sm'
          />
        </div>
      )}

      {data.pagination.page < data.pagination.totalPages && (
        <div className='py-4 text-center'>
          <p className='text-default-500 text-sm'>
            Page {data.pagination.page} of {data.pagination.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
