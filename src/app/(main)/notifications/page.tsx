'use client';

import React, { useState, useCallback } from 'react';
import {
  useUnreadNotificationsCount,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import NotificationsList from './NotificationsList';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { IoMdCheckmarkCircle } from 'react-icons/io';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);

  // Get unread count for header
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  // Mark all as read mutation
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  return (
    <div className='container mx-auto max-w-4xl space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-1'>
          <h1 className='text-foreground text-2xl font-bold'>Notifications</h1>
          <p className='text-default-600 text-sm'>
            Stay updated with your content and system activities
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {unreadCount > 0 && (
            <Chip color='danger' size='sm'>
              {unreadCount} unread
            </Chip>
          )}
          {unreadCount > 0 && (
            <Button
              color='primary'
              variant='flat'
              size='sm'
              onPress={handleMarkAllAsRead}
              isLoading={markAllAsReadMutation.isPending}
              startContent={
                !markAllAsReadMutation.isPending && <IoMdCheckmarkCircle />
              }
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <NotificationsList
        page={page}
        onPageChange={handlePageChange}
        search=''
        status='all'
        type=''
      />
    </div>
  );
}
